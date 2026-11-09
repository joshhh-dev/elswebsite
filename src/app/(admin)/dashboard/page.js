"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import InquiryCard, { STAGES } from "@/app/components/InquiryCard";

// A logged-in user is either:
// - an admin — sees a pipeline summary (this page) with a link into the
//   full per-partner inquiry list at /dashboard/inquiries, or
// - a dealer — sees their own inquiries (where dealerSlug matches their
//   profile's slug) directly here, same as always.

export default function DashboardPage() {
  const { isAdmin, dealer, roleChecked, canManageInquiries } = useDashboard();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [dealersBySlug, setDealersBySlug] = useState({}); // slug -> company name

  useEffect(() => {
    if (!roleChecked || !isAdmin || !canManageInquiries) return;
    getDocs(collection(db, "dealers")).then((snap) => {
      const map = {};
      snap.forEach((d) => {
        const data = d.data();
        if (data.slug) map[data.slug] = data.company;
      });
      setDealersBySlug(map);
    });
  }, [roleChecked, isAdmin, canManageInquiries]);

  useEffect(() => {
    if (!roleChecked) return;
    if (isAdmin && !canManageInquiries) return;
    if (!isAdmin && !dealer?.slug) {
      setLoadingInquiries(false);
      return;
    }

    const q = isAdmin
      ? query(collection(db, "inquiries"), orderBy("createdAt", "desc"))
      : query(
          collection(db, "inquiries"),
          where("dealerSlug", "==", dealer.slug),
          orderBy("createdAt", "desc")
        );

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
  }, [roleChecked, isAdmin, dealer, canManageInquiries]);

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

  if (!roleChecked || (isAdmin && !canManageInquiries)) {
    return <main className="page-center">Loading...</main>;
  }

  if (isAdmin) {
    const countByStage = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
    const wonByDealer = {};
    const totalByDealer = {};
    inquiries.forEach((inq) => {
      const status = inq.status || "new";
      countByStage[status] = (countByStage[status] || 0) + 1;
      totalByDealer[inq.dealerSlug] = (totalByDealer[inq.dealerSlug] || 0) + 1;
      if (status === "won") {
        wonByDealer[inq.dealerSlug] = (wonByDealer[inq.dealerSlug] || 0) + 1;
      }
    });

    const topPartners = Object.keys(totalByDealer)
      .map((slug) => ({
        slug,
        company: dealersBySlug[slug] || slug,
        won: wonByDealer[slug] || 0,
        total: totalByDealer[slug],
      }))
      .sort((a, b) => b.won - a.won || b.total - a.total)
      .slice(0, 5);

    return (
      <div className="dashboard">
        <div className="posts-header">
          <h2>Overview</h2>
          <Link href="/dashboard/inquiries" className="btn-primary posts-new-btn" style={{ textAlign: "center" }}>
            View all inquiries
          </Link>
        </div>

        {loadingInquiries ? (
          <p>Loading overview...</p>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-card">
                <span className="stat-number">{inquiries.length}</span>
                <span className="stat-label">Total inquiries</span>
              </div>
              {STAGES.map((s) => (
                <div key={s.value} className={`stat-card stat-card-${s.value}`}>
                  <span className="stat-number">{countByStage[s.value] || 0}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 32 }}>Top partners</h3>
            {topPartners.length === 0 ? (
              <div className="empty-state">
                <h2>No inquiries yet</h2>
                <p>Partner performance will show up here once inquiries start coming in.</p>
              </div>
            ) : (
              topPartners.map((p) => (
                <div key={p.slug} className="post-list-item" style={{ cursor: "default" }}>
                  <strong>{p.company}</strong>
                  <span className="inquiry-preview">
                    {p.won} won · {p.total} total
                  </span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {loadingInquiries ? (
        <p>Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <div className="empty-state">
          <h2>No inquiries yet</h2>
          <p>
            Inquiries assigned to you will show up here once a visitor fills
            out the form on the website.
          </p>
        </div>
      ) : (
        inquiries.map((inq) => (
          <InquiryCard
            key={inq.id}
            inquiry={inq}
            expanded={expandedId === inq.id}
            onToggleExpand={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
    </div>
  );
}
