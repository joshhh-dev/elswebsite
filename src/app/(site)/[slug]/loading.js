// Instant fallback for every product page (/lg, /lac, etc. — all served by
// the dynamic page.js in this folder) while it awaits its Firestore read.
export default function ProductLoading() {
  return (
    <main className="relative flex flex-col overflow-hidden animate-pulse">
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-12 pt-32 md:pt-40 pb-20 bg-gray-900">
        <div className="h-10 md:h-14 w-2/3 max-w-2xl bg-white/20 rounded-lg mb-6" />
        <div className="h-6 w-1/2 max-w-xl bg-white/15 rounded-lg" />
      </section>

      <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </section>

      <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
