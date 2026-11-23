"use client";

import { createContext, useContext } from "react";

// Shared auth/role state for everything under /dashboard, set up once by
// dashboard/layout.js so each page (Inquiries, Posts, ...) doesn't have to
// repeat the same onAuthStateChanged + role-lookup logic.
export const DashboardContext = createContext({
  user: undefined, // undefined = still checking, null = signed out
  isAdmin: false,
  dealer: null,
  roleChecked: false,
  // Only meaningful when isAdmin is true. role is "admin" (full access,
  // also the default when an admins/{uid} doc has no role field — keeps
  // every pre-existing admin account unrestricted), "developer" (same as
  // admin, plus staff management), "inquiries", or "publisher".
  // canManageInquiries/canPublish/canManageStaff are the derived checks
  // every dashboard page/guard should actually use.
  role: "admin",
  canManageInquiries: true,
  canPublish: true,
  canManageStaff: false,
  // Only meaningful when isAdmin is false — derived once here from
  // `dealer` (see src/lib/dealerRoles.js) so every page checks the same
  // thing instead of re-deriving this predicate itself.
  isDealerOwner: false,
  isDealerStaff: false,
  // slug -> company name for every dealers doc, admin-only (fetched once
  // in dashboard/layout.js and shared here instead of each admin page
  // independently re-fetching the same collection).
  dealersBySlug: {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}
