"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  deleteField,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import { logIfUnexpected } from "@/lib/logIfUnexpected";
import { INQUIRIES_WINDOW_SIZE } from "@/lib/inquiriesWindow";
import { downloadInquiryAttachment } from "@/lib/callDashboardApi";
import InquiryCard, { STAGES, INQUIRY_TYPES, stageLabel, inquiryTypeLabel, formatDate } from "@/app/components/InquiryCard";

// Admin-only: every inquiry across every partner, with a sidebar to filter
// by partner. A dealer has their own, simpler inquiry list at /dashboard
// instead (see dashboard/page.js) — this full cross-partner view doesn't
// apply to them.

const PAGE_SIZE = 10;

// The query itself is capped (not just rendering) — an unbounded listener
// over every inquiry ever created doesn't scale. New docs are always the
// newest, so they stay inside the window and onSnapshot still updates live;
// "Load older inquiries" just widens the window and re-subscribes.
const WINDOW_SIZE = INQUIRIES_WINDOW_SIZE;

const CSV_COLUMNS = [
  "Date",
  "Partner",
  "Name",
  "Email",
  "Phone",
  "Location",
  "Product",
  "Product item",
  "Inquiry type",
  "Status",
  "Message",
];

function csvCell(value) {
  let str = String(value ?? "");
  // Inquiry fields come straight from public, unauthenticated form
  // submissions — a value starting with =, +, -, or @ opens a cell as a
  // live formula in Excel/Sheets (CSV/formula injection). Prefix with a
  // bare quote, the standard mitigation: Excel/Sheets treat it as a
  // leading apostrophe (forces text, invisible in the rendered cell) and
  // it's harmless plain text everywhere else.
  if (/^[=+\-@]/.test(str)) str = `'${str}`;
  // Rows are joined with \r\n — a bare \r in the value (e.g. old Mac-style
  // line breaks in a pasted message) must be quoted too, or it reads as a
  // real row terminator to a strict CSV parser.
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function inquiriesToCsv(inquiries, dealersBySlug) {
  const rows = inquiries.map((inq) => [
    formatDate(inq.createdAt),
    dealersBySlug[inq.dealerSlug] || inq.dealerSlug || "",
    inq.name || "",
    inq.email || "",
    inq.phone || "",
    inq.location || "",
    inq.product || "",
    inq.productItem || "",
    inquiryTypeLabel(inq.inquiryType),
    stageLabel(inq.status),
    inq.message || "",
  ]);
  return [CSV_COLUMNS, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function downloadCsv(csv, filename) {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function InquiriesPage() {
  const router = useRouter();
  const { isAdmin, roleChecked, canManageInquiries, dealersBySlug } = useDashboard();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [dealerFilter, setDealerFilter] = useState("all"); // "all" or a dealerSlug
  const [statusFilter, setStatusFilter] = useState("all"); // "all" or a STAGES value
  const [locationFilter, setLocationFilter] = useState("all"); // "all" or an inquiry.location value
  const [productFilter, setProductFilter] = useState("all"); // "all" or an inquiry.product value
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState("all"); // "all" or an INQUIRY_TYPES value
  const [searchQuery, setSearchQuery] = useState(""); // free-text, matched against name/email/phone/message/location/product
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [windowSize, setWindowSize] = useState(WINDOW_SIZE);
  const [newStatusInquiries, setNewStatusInquiries] = useState([]); // see effect below
  const [filterOptions, setFilterOptions] = useState({ locations: [], products: [] });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [dealerFilter, statusFilter, locationFilter, productFilter, inquiryTypeFilter, searchQuery]);

  const canView = isAdmin && canManageInquiries;

  useEffect(() => {
    if (roleChecked && !canView) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canView, router]);

  // Sourced from the denormalized metadata/inquiryFilters doc (updated by
  // /api/product-inquiry via arrayUnion), not the windowed inquiries list
  // above — a location/product that only appears on inquiries older than
  // the window would otherwise have no dropdown option to select it by.
  useEffect(() => {
    if (!roleChecked || !canView) return;
    getDoc(doc(db, "metadata", "inquiryFilters"))
      .then((snap) => {
        const data = snap.exists() ? snap.data() : {};
        setFilterOptions({
          locations: (data.locations || []).slice().sort((a, b) => a.localeCompare(b)),
          products: (data.products || []).slice().sort((a, b) => a.localeCompare(b)),
        });
      })
      .catch(logIfUnexpected);
  }, [roleChecked, canView]);

  useEffect(() => {
    if (!roleChecked || !canView) return;

    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(windowSize));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingInquiries(false);
      },
      (err) => {
        logIfUnexpected(err);
        setLoadingInquiries(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, canView, windowSize]);

  // Dedicated to the sidebar's per-partner "new" count badges — the main
  // list above is windowed (limit(windowSize)) to the most RECENT N, which
  // undercounts "new" once total volume exceeds that window (a partner
  // whose only inquiries are older than the window would wrongly show 0).
  // A plain equality filter on status needs no new composite index, and
  // the "New" bucket is naturally bounded to leads not yet processed.
  useEffect(() => {
    if (!roleChecked || !canView) return;
    const q = query(collection(db, "inquiries"), where("status", "==", "new"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => setNewStatusInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      logIfUnexpected
    );
    return () => unsubscribe();
  }, [roleChecked, canView]);

  const handleReassign = async (inquiryId, newSlug) => {
    const current = inquiries.find((inq) => inq.id === inquiryId);
    if (!current || current.dealerSlug === newSlug) return;
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        dealerSlug: newSlug,
        reassignedFrom: current.dealerSlug,
        reassignedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Moving to a different partner must drop any existing staff
        // assignment — the old partner's staff member should not keep
        // access to a lead that now belongs to someone else (enforced
        // server-side too, see firestore.rules).
        assignedStaff: deleteField(),
        assignedStaffAt: deleteField(),
      });
    } catch (err) {
      // User-initiated write, not a passive listener — a permission-denied
      // here is a real rejection, must not be silently swallowed.
      console.error(err);
    }
  };

  if (!roleChecked || !canView) {
    return <main className="page-center">Loading...</main>;
  }

  // "New" = not contacted yet — this is what the sidebar badges count, so
  // the admin can tell at a glance which partners need attention. Sourced
  // from the dedicated newStatusInquiries query (see effect above), not
  // the windowed main list, so a partner whose only leads are older than
  // the window still shows an accurate count.
  const newCountBySlug = {};
  let totalNewCount = 0;
  newStatusInquiries.forEach((inq) => {
    newCountBySlug[inq.dealerSlug] = (newCountBySlug[inq.dealerSlug] || 0) + 1;
    totalNewCount += 1;
  });

  const { locations, products } = filterOptions;

  const trimmedSearch = searchQuery.trim().toLowerCase();

  const visibleInquiries = inquiries.filter((inq) => {
    if (dealerFilter !== "all" && inq.dealerSlug !== dealerFilter) return false;
    if (statusFilter !== "all" && (inq.status || "new") !== statusFilter) return false;
    if (locationFilter !== "all" && inq.location !== locationFilter) return false;
    if (productFilter !== "all" && inq.product !== productFilter) return false;
    if (inquiryTypeFilter !== "all" && (inq.inquiryType || "general") !== inquiryTypeFilter) return false;
    if (trimmedSearch) {
      const haystack = [inq.name, inq.email, inq.phone, inq.message, inq.location, inq.product]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(trimmedSearch)) return false;
    }
    return true;
  });

  const pagedInquiries = visibleInquiries.slice(0, visibleCount);
  const hasMore = visibleCount < visibleInquiries.length;

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
          .sort((a, b) => (a[1] || "").localeCompare(b[1] || ""))
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
        <div className="inquiries-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search name, email, phone, message, location, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="see-more-btn export-csv-btn"
            onClick={() => downloadCsv(inquiriesToCsv(visibleInquiries, dealersBySlug), `inquiries-${Date.now()}.csv`)}
            disabled={visibleInquiries.length === 0}
          >
            Export CSV ({visibleInquiries.length})
          </button>
        </div>

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
          <select
            className="location-filter-select"
            value={inquiryTypeFilter}
            onChange={(e) => setInquiryTypeFilter(e.target.value)}
          >
            <option value="all">All inquiry types</option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {!loadingInquiries && inquiries.length === windowSize && (
          <p className="window-note">
            Showing the most recent {windowSize} inquiries — Load older to search further back.
          </p>
        )}

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
                productFilter === "all" &&
                inquiryTypeFilter === "all" &&
                !trimmedSearch
                  ? "Inquiries from every partner will show up here once a visitor fills out a form on the website."
                  : "Try a different partner, status, location, product, inquiry type, or search term."}
              </p>
            </div>
          ) : (
            <>
              {pagedInquiries.map((inq) => (
                <InquiryCard
                  key={inq.id}
                  inquiry={inq}
                  showDealer
                  dealerName={dealersBySlug[inq.dealerSlug]}
                  dealersBySlug={dealersBySlug}
                  onReassign={handleReassign}
                  expanded={expandedId === inq.id}
                  onToggleExpand={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                  onDownloadAttachment={downloadInquiryAttachment}
                />
              ))}
              {hasMore && (
                <button
                  type="button"
                  className="see-more-btn"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  See more ({visibleInquiries.length - visibleCount} remaining)
                </button>
              )}
            </>
          )}
          {!loadingInquiries && inquiries.length === windowSize && (
            <button
              type="button"
              className="see-more-btn"
              onClick={() => setWindowSize((w) => w + WINDOW_SIZE)}
            >
              Load older inquiries
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
