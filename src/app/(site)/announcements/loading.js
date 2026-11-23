// Instant fallback for /announcements while it awaits its Firestore read.
export default function AnnouncementsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-40 md:pt-52 pb-20 px-5 md:px-12 lg:px-20 animate-pulse">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-10">Announcements</h1>

        <div className="flex flex-col gap-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 md:p-10 flex flex-col gap-5">
              <div>
                <div className="h-7 w-2/3 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
