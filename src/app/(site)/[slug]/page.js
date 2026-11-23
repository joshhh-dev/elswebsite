import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebaseAdmin";
import ContentBlock from "@/app/components/ContentBlock";
import ProductSplitLayout from "@/app/components/ProductSplitLayout";
import ProductItemsGrid from "@/app/components/ProductItemsGrid";
import ProductInquiryForm from "@/app/components/ProductInquiryForm";

// Dynamic product page — renders any product the admin has published from
// the RBPN Dealer Portal's "Products" section. Replaces the old per-product
// hardcoded pages (previously src/app/lg, scarpavapor, prols, lac, lms).
// Next.js matches existing static routes (/rbpn, /announcements,
// /quick-links/*, etc.) before falling through to this [slug] route, so
// nothing else on the site is shadowed by it.
export const revalidate = 0; // always fetch fresh — this is admin-controlled content

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snapshot.empty) return {};
    const product = snapshot.docs[0].data();
    return {
      title: `${product.name} | ELS Philippines Inc.`,
      description: product.tagline || undefined,
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (!snapshot.empty) {
      product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
  } catch (err) {
    console.error("Failed to load product:", err);
  }

  if (!product) notFound();

  // Only fetched when actually needed — the relatedProducts block has no
  // admin-entered data of its own, so siblings sharing this product's
  // category are looked up here instead. Two equality filters need no
  // composite index (see firestore.rules' similar metadata/inquiryFilters
  // comment).
  let relatedProducts = [];
  const hasRelatedProductsBlock = (product.blocks || []).some((b) => b.type === "relatedProducts");
  if (hasRelatedProductsBlock && product.category) {
    try {
      // Sorted/capped client-side rather than via orderBy("order") server-
      // side — two equality filters plus a sort on a third field needs a
      // composite index in Firestore, an extra manual Console step not
      // worth it for how small each category's product count is today.
      const siblingsSnapshot = await adminDb
        .collection("products")
        .where("category", "==", product.category)
        .where("status", "==", "published")
        .get();
      relatedProducts = siblingsSnapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.id !== product.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          heroImage: p.heroImage,
        }));
    } catch (err) {
      console.error("Failed to load related products:", err);
    }
  }

  return (
    <main className="relative flex flex-col overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      {/* A rounded, constrained-width image banner with the name/tagline
          overlaid bottom-left (per the Figma redesign's category-hub hero —
          see project_figma_redesign_phases.md, Phase 2), not the old
          full-bleed edge-to-edge dark hero. Wrapped in a solid navy backdrop
          band so the (fixed, semi-transparent) header still has a dark
          background behind it instead of plain white — the old full-bleed
          photo used to serve that role. Falls back to centered text with no
          image card when a product has no hero image yet (e.g. LAC/ProLS,
          which have no real content authored for them yet) — still on the
          same navy backdrop, so the header stays legible either way. */}
      <div className="bg-brand-navy">
        <section className="max-w-6xl mx-auto px-6 pt-28 md:pt-36 pb-10 md:pb-16">
          {product.heroImage ? (
            <div className="relative rounded-3xl overflow-hidden h-[360px] md:h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.heroImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="text-base md:text-xl text-gray-100 max-w-2xl drop-shadow-md">
                    {product.tagline}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{product.name}</h1>
              {product.tagline && (
                <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto">{product.tagline}</p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ===== CONTENT BLOCKS ===== */}
      {product.template === "split" ? (
        <ProductSplitLayout blocks={product.blocks || []} relatedProducts={relatedProducts} />
      ) : (
        <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {(product.blocks || []).map((block, i) => (
              <ContentBlock key={i} block={block} index={i} relatedProducts={relatedProducts} />
            ))}
          </div>
        </section>
      )}

      <ProductItemsGrid items={product.items} />

      <ProductInquiryForm product={product.name} items={product.items || []} />
    </main>
  );
}
