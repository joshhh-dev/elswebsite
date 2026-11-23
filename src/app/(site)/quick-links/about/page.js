// Redesigned per the Figma full-site redesign (Phase 1 — see
// project_figma_redesign_phases.md). Hand-coded, like the previous version —
// unlike product pages, this corporate "About Us" page isn't CMS-driven, so
// copy changes still need a code change. Content (stats, vision/mission,
// core values) is text-only in the Figma source, so no new image assets were
// needed here.

const STATS = [
  { value: "50,000+", label: "Project and Installations" },
  { value: "120,000+", label: "Equipment Supplied" },
  { value: "10,000+", label: "Trainings & Seminars Conducted" },
  { value: "60+", label: "In-House Experts" },
  { value: "20+", label: "Nationwide Partners" },
  { value: "1,500m²", label: "Warehouse Capacity" },
];

const CORE_VALUES = [
  "Integrity & Responsible Stewardship",
  "Customer Commitment and Partnership",
  "Mastery and Continuous Learning",
  "Strategic Foresight and Sustainable Innovation",
  "Excellence and Reliability",
  "One Team, Shared Success",
  "Discipline Execution and Accountability",
];

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900">
      {/* ==== HERO ==== */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          ABOUT ELS PHILS., INC.
        </h1>
        <p className="text-xl md:text-2xl font-semibold mb-8">
          Complete <span className="text-brand-blue">Laundry Solutions</span>.
          <br className="hidden md:block" /> From Business Planning to After-Sales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              ELS Phils., Inc. has been serving the Philippine laundry and
              cleaning industry since 1987, providing professional solutions
              for entrepreneurs, laundry businesses, hotels, resorts,
              restaurants, hospitals, institutions, and industrial facilities.
            </p>
            <p>
              More than an equipment supplier, ELS helps customers plan,
              build, improve, and maintain laundry operations through
              professional equipment, business consultation, system planning,
              installation, training, laundry chemicals, spare parts,
              technical service, and after-sales support.
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed md:pl-10 md:border-l md:border-gray-200">
            Our approach begins with understanding each customer&apos;s actual
            requirements. We develop solutions based on business objectives,
            laundry capacity, available space, workflow, utilities, operating
            costs, quality requirements, and opportunities for future growth.
          </p>
        </div>
      </section>

      {/* ==== MORE THAN AN EQUIPMENT SUPPLIER (stats) ==== */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          More Than an Equipment Supplier
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          ELS helps customers plan, build, improve and maintain professional
          laundry operations through equipment, consultation, installation,
          training, chemicals, technical support and after-sales service.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 text-white rounded-2xl px-6 py-8"
            >
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==== OUR DIRECTION ==== */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
          OUR DIRECTION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          <div>
            <h3 className="text-xl font-bold mb-3">VISION</h3>
            <p className="text-gray-700 leading-relaxed">
              ELS Phils, Inc, is the most innovative leader in the laundry and
              cleaning industry with excellent and reliable products and
              services giving our customers the best solutions for their
              needs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">MISSION</h3>
            <p className="text-gray-700 leading-relaxed">
              We professionally empower our customers and partners by
              providing solutions making their lives easier, more profitable,
              and more sustainable so that they actively do business with us.
            </p>
          </div>
        </div>
      </section>

      {/* ==== CORE VALUES ==== */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
          CORE VALUES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 text-center">
          {CORE_VALUES.map((value, i) => (
            <div key={value}>
              <div className="text-brand-blue text-2xl font-bold mb-2">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-gray-700">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
