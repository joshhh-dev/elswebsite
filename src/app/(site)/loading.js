// Instant fallback (Next.js App Router Suspense convention) shown while
// src/app/(site)/page.js awaits its Firestore read for featured products.
// Only covers the above-the-fold hero + product grid — the static sections
// further down (Find a Dealer, At a Glance, Locations) don't depend on that
// fetch and won't be visible until the real content has long since loaded.
export default function HomeLoading() {
  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden animate-pulse">
      <section className="relative flex flex-col items-center justify-center min-h-[130vh] bg-gray-900 px-6">
        <div className="h-12 md:h-16 w-3/4 max-w-3xl bg-white/20 rounded-lg mb-6" />
        <div className="h-7 md:h-8 w-1/2 max-w-md bg-white/15 rounded-lg mb-6" />
        <div className="h-5 w-64 bg-white/10 rounded-lg mb-10" />
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-2xl">
          <div className="h-12 flex-1 bg-white/15 rounded-full" />
          <div className="h-12 flex-1 bg-white/15 rounded-full" />
        </div>
      </section>

      <section className="relative py-20 px-5 md:px-12 lg:px-20 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-10 max-w-9xl mx-auto">
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
            <div className="h-10 md:h-14 w-3/4 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-9xl mx-auto auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[300px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`bg-gray-200 rounded-lg ${
                i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
              }`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
