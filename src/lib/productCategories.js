// Fixed top-level "Solutions" categories for the mega-menu nav (see
// project_figma_redesign_phases.md, Phase 1) — a product is grouped under
// one of these via its admin-set `category` field. The list itself is a
// plain constant, not admin-editable: this top-level taxonomy is expected to
// change rarely, unlike which products sit under each one.
export const PRODUCT_CATEGORIES = [
  "Laundry Equipment Solutions",
  "Professional Laundry Solutions",
  "System Solutions",
  "Cleaning Solutions",
  "Display/Ads Solutions",
];
