"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import InquiryCard, { STAGES } from "@/app/components/InquiryCard";

// Admin-only: every inquiry across every partner, with a sidebar to filter
// by partner. A dealer has their own, simpler inquiry list at /dashboard
// instead (see dashboard/page.js) — this full cross-partner view doesn't
// apply to them.
export default function InquiriesPage() {
  const router = useRouter();
  const { isAdmin, roleChecked, canManageInquiries } = useDashboard();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [dealersBySlug, setDealersBySlug] = useState({}); // slug -> company name
  const [dealerFilter, setDealerFilter] = useState("all"); // "all" or a dealerSlug
  const [statusFilter, setStatusFilter] = useState("all"); // "all" or a STAGES value
  const [locationFilter, setLocationFilter] = useState("all"); // "all" or an inquiry.location value
  const [productFilter, setProductFilter] = useState("all"); // "all" or an inquiry.product value

  const canView = isAdmin && canManageInquiries;

  useEffect(() => {
    if (roleChecked && !canView) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canView, router]);

  useEffect(() => {
    if (!roleChecked || !canView) return;
    getDocs(collection(db, "dealers")).then((snap) => {
      const map = {};
      snap.forEach((d) => {
        const data = d.data();
        if (data.slug) map[data.slug] = data.company;
      });
      setDealersBySlug(map);
    });
  }, [roleChecked, canView]);

  useEffect(() => {
    if (!roleChecked || !canView) return;

    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingInquiries(false);
      },
      (err) => {
        console.error(err);
        setLoadingInquiries(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, canView]);

  const handleStatusChange = async (inquiryId, status) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassign = async (inquiryId, newSlug) => {
    const current = inquiries.find((inq) => inq.id === inquiryId);
    if (!current || current.dealerSlug === newSlug) return;
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        dealerSlug: newSlug,
        reassignedFrom: current.dealerSlug,
        reassignedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!roleChecked || !canView) {
    return <main className="page-center">Loading...</main>;
  }

  // "New" = not contacted yet — this is what the sidebar badges count, so
  // the admin can tell at a glance which partners need attention.
  const newCountBySlug = {};
  let totalNewCount = 0;
  inquiries.forEach((inq) => {
    if ((inq.status || "new") === "new") {
      newCountBySlug[inq.dealerSlug] = (newCountBySlug[inq.dealerSlug] || 0) + 1;
      totalNewCount += 1;
    }
  });

  const locations = Array.from(
    new Set(inquiries.map((inq) => inq.location).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const products = Array.from(
    new Set(inquiries.map((inq) => inq.product).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const visibleInquiries = inquiries.filter((inq) => {
    if (dealerFilter !== "all" && inq.dealerSlug !== dealerFilter) return false;
    if (statusFilter !== "all" && (inq.status || "new") !== statusFilter) return false;
    if (locationFilter !== "all" && inq.location !== locationFilter) return false;
    if (productFilter !== "all" && inq.product !== productFilter) return false;
    return true;
  });

  return (
    <div className="dashboard-layout">
      <aside className="partner-sidebar">
        <button
          className={`partner-item ${dealerFilter === "all" ? "active" : ""}`}
          onClick={() => setDealerFilter("all")}
        >
          <span>All partners</span>
          {totalNewCount > 0 && <span className="new-count-badge">{totalNewCount}</span>}
        </button>
        {Object.entries(dealersBySlug)
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map(([slug, company]) => (
            <button
              key={slug}
              className={`partner-item ${dealerFilter === slug ? "active" : ""}`}
              onClick={() => setDealerFilter(slug)}
            >
              <span>{company}</span>
              {newCountBySlug[slug] > 0 && <span className="new-count-badge">{newCountBySlug[slug]}</span>}
            </button>
          ))}
      </aside>

      <div className="dashboard dashboard-content">
        <div className="status-filter-bar">
          <button
            type="button"
            className={`status-filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`status-filter-btn status-stage-${s.value} ${statusFilter === s.value ? "active" : ""}`}
              onClick={() => setStatusFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
          <select
            className="location-filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            className="location-filter-select"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="all">All products</option>
            {products.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        <div className="inquiry-list-scroll">
          {loadingInquiries ? (
            <p>Loading inquiries...</p>
          ) : visibleInquiries.length === 0 ? (
            <div className="empty-state">
              <h2>No inquiries match this filter</h2>
              <p>
                {dealerFilter === "all" &&
                statusFilter === "all" &&
                locationFilter === "all" &&
                productFilter === "all"
                  ? "Inquiries from every partner will show up here once a visitor fills out a form on the website."
                  : "Try a different partner, status, location, or product filter."}
              </p>
            </div>
          ) : (
            visibleInquiries.map((inq) => (
              <InquiryCard
                key={inq.id}
                inquiry={inq}
                showDealer
                dealerName={dealersBySlug[inq.dealerSlug]}
                dealersBySlug={dealersBySlug}
                onReassign={handleReassign}
                expanded={expandedId === inq.id}
                onToggleExpand={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
