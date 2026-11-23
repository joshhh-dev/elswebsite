"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { DashboardContext } from "@/lib/DashboardContext";
import { logIfUnexpected } from "@/lib/logIfUnexpected";
import { isOwnerDealerDoc, isStaffDealerDoc } from "@/lib/dealerRoles";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined);
  const [dealer, setDealer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState("admin");
  const [roleChecked, setRoleChecked] = useState(false);
  const [dealersBySlug, setDealersBySlug] = useState({}); // slug -> company name, admin-only

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        router.replace("/login");
        return;
      }
      setUser(firebaseUser);

      const adminSnap = await getDoc(doc(db, "admins", firebaseUser.uid));
      if (adminSnap.exists()) {
        setIsAdmin(true);
        setAdminRole(adminSnap.data().role || "admin");
      } else {
        const dealerSnap = await getDoc(doc(db, "dealers", firebaseUser.uid));
        setDealer(dealerSnap.exists() ? dealerSnap.data() : null);
        // Dealer role/slug live in this token's custom claims (see
        // firestore.rules), not this Firestore doc — refresh so a tab
        // left open across a claims backfill/update picks up the new
        // values without requiring a full logout/login. Admins don't use
        // these claims at all (their role comes from the admins doc
        // above), so this only runs for the dealer path. Awaited: this
        // page's own dealer queries fire right after roleChecked flips to
        // true below, so a fire-and-forget refresh could leave the very
        // first query using a stale token right after a claims backfill.
        await firebaseUser.getIdToken(true).catch(() => {});
      }
      setRoleChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const canManageInquiries = adminRole === "admin" || adminRole === "developer" || adminRole === "inquiries";
  const canPublish = adminRole === "admin" || adminRole === "developer" || adminRole === "publisher";
  const canManageStaff = adminRole === "developer";
  const isDealerOwner = !isAdmin && isOwnerDealerDoc(dealer);
  const isDealerStaff = !isAdmin && isStaffDealerDoc(dealer);

  // Shared by every admin page that needs a slug -> company name lookup
  // (Overview, Inquiries) — fetched once here instead of each page
  // independently re-fetching the same collection.
  useEffect(() => {
    if (!roleChecked || !isAdmin || !canManageInquiries) return;
    getDocs(collection(db, "dealers"))
      .then((snap) => {
        const map = {};
        snap.forEach((d) => {
          const data = d.data();
          if (data.slug) map[data.slug] = data.company;
        });
        setDealersBySlug(map);
      })
      .catch(logIfUnexpected);
  }, [roleChecked, isAdmin, canManageInquiries]);

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      dealer,
      roleChecked,
      role: adminRole,
      canManageInquiries,
      canPublish,
      canManageStaff,
      isDealerOwner,
      isDealerStaff,
      dealersBySlug,
    }),
    [
      user,
      isAdmin,
      dealer,
      roleChecked,
      adminRole,
      canManageInquiries,
      canPublish,
      canManageStaff,
      isDealerOwner,
      isDealerStaff,
      dealersBySlug,
    ]
  );

  if (!isFirebaseConfigured) {
    return (
      <main className="page-center">
        <div className="card">
          <span className="badge">Placeholder — not live yet</span>
          <h1 style={{ marginTop: 12 }}>Not set up yet</h1>
          <p className="subtitle">
            The Firebase config needs to be filled in first (see the README)
            before this dashboard will work.
          </p>
        </div>
      </main>
    );
  }

  if (user === undefined) {
    return <main className="page-center">Loading...</main>;
  }

  const adminLabel =
    adminRole === "developer"
      ? "Developer"
      : adminRole === "inquiries"
      ? "Admin (Inquiries)"
      : adminRole === "publisher"
      ? "Admin (Publishing)"
      : "Admin (All Partners)";

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="dashboard-shell">
        <div className="topbar">
          <span className="brand">
            RBPN Dealer Portal — {isAdmin ? adminLabel : dealer?.company || ""}
          </span>
          <button onClick={() => signOut(auth)}>Log out</button>
        </div>

        <div className="admin-shell">
          {isAdmin && (
            <nav className="dashboard-sidebar">
              {canManageInquiries && (
                <>
                  <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/inquiries"
                    className={pathname?.startsWith("/dashboard/inquiries") ? "active" : ""}
                  >
                    Inquiries
                  </Link>
                </>
              )}
              {canPublish && (
                <>
                  <Link
                    href="/dashboard/posts"
                    className={pathname?.startsWith("/dashboard/posts") ? "active" : ""}
                  >
                    Posts
                  </Link>
                  <Link
                    href="/dashboard/products"
                    className={pathname?.startsWith("/dashboard/products") ? "active" : ""}
                  >
                    Departments
                  </Link>
                </>
              )}
              {canManageStaff && (
                <>
                  <Link
                    href="/dashboard/staff"
                    className={pathname?.startsWith("/dashboard/staff") ? "active" : ""}
                  >
                    Staff
                  </Link>
                  <Link
                    href="/dashboard/dealers"
                    className={pathname?.startsWith("/dashboard/dealers") ? "active" : ""}
                  >
                    Accounts
                  </Link>
                </>
              )}
            </nav>
          )}

          {isDealerOwner && (
            <nav className="dashboard-sidebar">
              <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
                Inquiries
              </Link>
              <Link
                href="/dashboard/my-staff"
                className={pathname?.startsWith("/dashboard/my-staff") ? "active" : ""}
              >
                My Staff
              </Link>
            </nav>
          )}

          <div className="admin-main">{children}</div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
