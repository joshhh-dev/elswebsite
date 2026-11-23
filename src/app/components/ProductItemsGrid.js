"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Renders the individual products under a department page (e.g. specific
// LG washer/dryer models) as their own grid section — admin-managed via the
// "Our Products" field in the dashboard's Products editor. Cards are
// clickable, opening a modal with the full image + description.
//
// An optional free-text `item.group` (e.g. "Retail and Commercial Laundry
// Products" vs "Industrial Laundry Chemicals" on the ProLS page, matching
// the Figma redesign's tabbed catalog) turns on a tab filter above the
// grid — only when at least 2 distinct groups are actually present, so
// ungrouped items (every product before this feature, e.g. LG's items)
// keep rendering as a single flat grid exactly as before.
export default function ProductItemsGrid({ items = [] }) {
  const [selected, setSelected] = useState(null);

  const groups = useMemo(() => {
    const seen = [];
    items.forEach((item) => {
      if (item.group && !seen.includes(item.group)) seen.push(item.group);
    });
    return seen;
  }, [items]);

  const [activeGroup, setActiveGroup] = useState(null);
  const effectiveGroup = activeGroup ?? groups[0] ?? null;

  if (items.length === 0) return null;

  // Ungrouped items (no `group` set) are shown under every tab instead of
  // vanishing entirely — only items actually assigned to a DIFFERENT group
  // get filtered out.
  const visibleItems =
    groups.length > 1 ? items.filter((item) => !item.group || item.group === effectiveGroup) : items;

  return (
    <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-surface-muted">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-10 text-center">
          Our Products
        </h2>
        {groups.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  effectiveGroup === group
                    ? "bg-brand-blue text-white"
                    : "bg-white text-gray-600 border border-border-muted hover:border-brand-blue"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleItems.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(item)}
              className="text-left bg-white rounded-2xl border border-border-muted shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-lg cursor-pointer"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow"
              >
                <X size={20} className="text-gray-700" />
              </button>

              {selected.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.image} alt={selected.name} className="w-full max-h-96 object-contain bg-gray-50" />
              )}

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy mb-4">{selected.name}</h3>
                {selected.description && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
