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

  return (
    <main className="relative flex flex-col overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 md:px-12 pt-32 md:pt-40 pb-20">
        {product.heroImage && (
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.heroImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-6">
          {product.name}
        </h1>

        {product.tagline && (
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl leading-relaxed drop-shadow-lg">
            {product.tagline}
          </p>
        )}
      </section>

      {/* ===== CONTENT BLOCKS ===== */}
      {product.template === "split" ? (
        <ProductSplitLayout blocks={product.blocks || []} />
      ) : (
        <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {(product.blocks || []).map((block, i) => (
              <ContentBlock key={i} block={block} index={i} />
            ))}
          </div>
        </section>
      )}

      <ProductItemsGrid items={product.items} />

      <ProductInquiryForm product={product.name} items={product.items || []} />
    </main>
  );
}
