import Image from "next/image";
import Link from "next/link";
import { adminDb } from "@/lib/firebaseAdmin";

// New hub page from the Figma redesign's exhaustive re-scan (16.png) — hand-
// coded like Quick Links/About, not CMS-driven, since it's a fixed
// navigational page rather than an admin-managed product. Pulls the real
// hero photos for the 2 live products (LaundrysAPP, MULI) straight from
// their existing Firestore docs instead of duplicating/hardcoding image
// data here, so they stay in sync if those products' images ever change.
export const revalidate = 60;

async function getProductHero(slug) {
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().heroImage || null;
  } catch (err) {
    console.error(`Failed to load hero image for ${slug}:`, err);
    return null;
  }
}

export default async function BusinessSolutionsPage() {
  const [lmsHero, muliHero] = await Promise.all([
    getProductHero("lms"),
    getProductHero("muli"),
  ]);

  const cards = [
    {
      name: "Laundry Management System",
      href: "/lms",
      image: lmsHero,
    },
    {
      name: "My Urban Laundry",
      href: "/muli",
      // Figma's own hub card uses a placeholder mountain/sun icon here even
      // though MULI's own page already has real photos — reusing MULI's
      // real hero instead is a deliberate improvement over the literal
      // source, not an oversight.
      image: muliHero,
    },
  ];

  const comingSoon = ["Laundry Business Planning", "Business Consulting"];

  return (
    <div className="bg-white text-gray-900">
      {/* ==== HERO/INTRO ==== */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-center">
          Business Solutions
        </h1>
        <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl mx-auto">
          <p>
            Business Solutions provides end-to-end support for entrepreneurs
            and businesses looking to build, improve, or expand their laundry
            operations. From business planning and store development to
            operational systems and professional consulting, we help turn
            ideas into practical, sustainable laundry businesses.
          </p>
          <p>
            Our solutions include{" "}
            <strong>
              Laundry Business Planning, My Urban Laundry (MULI), Laundry
              Management System (LMS), and Business Consulting
            </strong>
            —designed to improve efficiency, standardize operations,
            strengthen customer experience, and support better business
            decisions.
          </p>
          <p>
            Whether you are starting a new laundry business, upgrading an
            existing operation, or planning your next expansion, our team can
            help you develop the right strategy, systems, and solutions. Talk
            to us today and let&apos;s build a smarter, more efficient laundry
            business together.
          </p>
        </div>
      </section>

      {/* ==== EXPLORE GRID ==== */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Explore Our Business Solutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative h-40 bg-gray-100">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                    {card.name}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{card.name}</h3>
              </div>
            </Link>
          ))}

          {comingSoon.map((name) => (
            <div
              key={name}
              aria-disabled="true"
              className="block rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            >
              <div className="relative h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Coming Soon
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-500">{name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
