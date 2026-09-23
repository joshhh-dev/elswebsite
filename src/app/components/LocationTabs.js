"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const LOCATIONS = [
  {
    id: "hq",
    label: "Headquarters",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4504048530343!2d121.04711337593516!3d14.604489077615018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7dbd8535953%3A0xbc4d300e59b70335!2sELS%20Philippines%20Inc.!5e0!3m2!1sen!2sph!4v1728200212345!5m2!1sen!2sph",
  },
  {
    id: "training",
    label: "lagoon® Training Facility",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.683656330788!2d121.1128500745722!3d14.560074178068666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7e1fc349dcd%3A0xb082ad84347e64dd!2sLagoon%20-%20Clean%20Tech%20Concept%20Corp.!5e0!3m2!1sen!2sph!4v1759797976629!5m2!1sen!2sph",
  },
  {
    id: "warehouse",
    label: "Mega Warehouse",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.7909017894854!2d121.12130849481277!3d14.565891201863083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c73bf8adf8bf%3A0x8cfc3dad2f82f79a!2s888%20Industrial%20Megacity!5e0!3m2!1sen!2sph!4v1759798155257!5m2!1sen!2sph",
  },
];

/**
 * Tabbed "Visit Us" locations — replaces stacking 3 full Google Maps
 * iframes back-to-back, which was heavy and made the page feel unfinished.
 */
export default function LocationTabs() {
  const [active, setActive] = useState(LOCATIONS[0].id);
  const current = LOCATIONS.find((loc) => loc.id === active);

  return (
    <section className="relative py-20 px-5 md:px-12 lg:px-20 bg-white">
      <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">Visit Us</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActive(loc.id)}
            className={`px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-colors ${
              active === loc.id
                ? "bg-brand-navy text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
      >
        <iframe
          src={current.embed}
          title={`Google Maps location: ${current.label}`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>
    </section>
  );
}
