import { adminDb } from "@/lib/firebaseAdmin";
import HomeContent from "@/app/components/HomeContent";

export const revalidate = 60;

// Homepage "Your turnkey solutions" grid is admin-managed — any published
// product with "Feature on homepage" checked (dashboard/products), ordered
// by its Order field. Fetched server-side, same pattern as (site)/layout.js's
// nav data, since HomeContent is a client component (framer-motion).
async function getFeaturedProducts() {
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("status", "==", "published")
      .where("featuredOnHome", "==", true)
      .get();
    return snapshot.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.tagline || data.name,
          tag: data.name,
          href: `/${data.slug}`,
          image: data.heroImage || "",
          order: data.order ?? 0,
        };
      })
      .sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Failed to load featured products:", err);
    return [];
  }
}

export default async function HomePage() {
  const solutions = await getFeaturedProducts();
  return <HomeContent solutions={solutions} />;
}
