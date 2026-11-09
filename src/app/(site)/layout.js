import Header from "../components/Header";
import Footer from "../components/Footer";
import { adminDb } from "@/lib/firebaseAdmin";

// Nav data (Products dropdown) is admin-managed in the dashboard —
// fetched here, server-side, and passed down to the (client) Header so the
// nav never needs its own client-side Firebase SDK. A short revalidate
// window keeps this off the hot path for every single page render while
// still picking up admin edits within a minute.
export const revalidate = 60;

async function getProducts() {
  try {
    const snapshot = await adminDb.collection("products").where("status", "==", "published").get();
    // Only pass plain, serializable fields through to the (client) Header —
    // the full docs include Firestore Timestamp instances (createdAt/
    // updatedAt), which can't cross the server->client component boundary.
    return snapshot.docs
      .map((d) => {
        const data = d.data();
        return { id: d.id, name: data.name, slug: data.slug, order: data.order ?? 0 };
      })
      .sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Failed to load nav data:", err);
    return [];
  }
}

export default async function SiteLayout({ children }) {
  const products = await getProducts();

  return (
    <>
      <Header products={products} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
