import { adminDb } from "@/lib/firebaseAdmin";

export const metadata = {
  title: "Announcements | ELS Philippines Inc.",
  description: "Latest updates and announcements from ELS Philippines Inc.",
};

// Server Component — reads published posts directly via the Firebase Admin
// SDK (server-only, bypasses Firestore security rules, no client Firebase
// SDK needed here). Posts are authored in the RBPN Dealer Portal's admin
// "Posts" section and published to the same "elsphilippines" Firestore
// project. Filtering is a single-field query (status == "published") and
// sorting happens in JS afterwards, so no composite index is required.
export const revalidate = 0; // always fetch fresh — this is admin-controlled content

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleDateString("en-PH", {
    dateStyle: "long",
  });
}

function PostBlock({ block, index }) {
  if (block.type === "text") {
    return (
      <p key={index} className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {block.content}
      </p>
    );
  }
  if (block.type === "image" && block.url) {
    return (
      <figure key={index}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.url} alt={block.caption || ""} className="w-full h-auto rounded-xl" />
        {block.caption && (
          <figcaption className="text-sm text-gray-500 mt-2 text-center">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return null;
}

export default async function AnnouncementsPage() {
  let posts = [];
  try {
    const snapshot = await adminDb.collection("posts").where("status", "==", "published").get();
    posts = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  } catch (err) {
    console.error("Failed to load announcements:", err);
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-40 md:pt-52 pb-20 px-5 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-10">Announcements</h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">No announcements yet — check back soon.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm p-6 md:p-10 flex flex-col gap-5"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
                </div>

                {(post.blocks || []).map((block, i) => (
                  <PostBlock key={i} block={block} index={i} />
                ))}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
