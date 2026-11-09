"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { DashboardContext } from "@/lib/DashboardContext";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined);
  const [dealer, setDealer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState("admin");
  const [roleChecked, setRoleChecked] = useState(false);

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
      }
      setRoleChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const canManageInquiries = adminRole === "admin" || adminRole === "developer" || adminRole === "inquiries";
  const canPublish = adminRole === "admin" || adminRole === "developer" || adminRole === "publisher";
  const canManageStaff = adminRole === "developer";

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
    <DashboardContext.Provider
      value={{ user, isAdmin, dealer, roleChecked, role: adminRole, canManageInquiries, canPublish, canManageStaff }}
    >
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
                <Link
                  href="/dashboard/staff"
                  className={pathname?.startsWith("/dashboard/staff") ? "active" : ""}
                >
                  Staff
                </Link>
              )}
            </nav>
          )}

          <div className="admin-main">{children}</div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
