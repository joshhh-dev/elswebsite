// Single source of truth for the dealers/{uid} owner-vs-staff predicate —
// a doc with no `role` field (pre-existing accounts) or role === "owner"
// is the dealer/company owner; role === "staff" is a sub-account created
// by the owner (see /api/dealer-staff). Plain JS, no Firebase/React
// dependency, so it's safe to import from both client components and
// server-side API routes — they read the same doc shape.
export function isOwnerDealerDoc(data) {
  return !!data && (!data.role || data.role === "owner");
}

export function isStaffDealerDoc(data) {
  return !!data && data.role === "staff";
}
