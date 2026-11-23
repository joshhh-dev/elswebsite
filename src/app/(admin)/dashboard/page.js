"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { isStaffDealerDoc } from "@/lib/dealerRoles";
import { INQUIRIES_WINDOW_SIZE } from "@/lib/inquiriesWindow";
import { downloadInquiryAttachment } from "@/lib/callDashboardApi";
import InquiryCard, { STAGES, STAGE_COLORS } from "@/app/components/InquiryCard";

// A logged-in user is either:
// - an admin — sees a pipeline summary (this page) with a link into the
//   full per-partner inquiry list at /dashboard/inquiries, or
// - a dealer — sees their own inquiries (where dealerSlug matches their
//   profile's slug) directly here, same as always.

const DAY_MS = 24 * 60 * 60 * 1000;
const OVERDUE_PAGE_SIZE = 10;

// The admin/dealer-owner query is capped (not just rendering) — an
// unbounded listener over every inquiry ever created doesn't scale. New
// docs are always the newest, so they stay inside the window and onSnapshot
// still updates live; "Load older inquiries" just widens the window and
// re-subscribes. The staff query (assignedStaff==uid) stays unbounded —
// scoped to one person's own assigned leads, not a growth concern.
const WINDOW_SIZE = INQUIRIES_WINDOW_SIZE;

// Overview date-range filter — the preset rows a date-range control should
// offer (dataviz skill): today, last 7/30/90 days, month-to-date, all time.
// Scopes every number on the page (stat cards, rings, needs-attention, top
// partners), so "5 won" always has an explicit, visible time window instead
// of defaulting to a silent "all time" nobody chose.
const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "mtd", label: "Month-to-date" },
];

function dateRangeCutoffMs(range) {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    case "7d":
      return now.getTime() - 7 * DAY_MS;
    case "30d":
      return now.getTime() - 30 * DAY_MS;
    case "90d":
      return now.getTime() - 90 * DAY_MS;
    case "mtd":
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    default:
      return null; // "all" — no cutoff
  }
}

function formatDuration(ms) {
  const hours = ms / (60 * 60 * 1000);
  if (hours < 48) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

// Inquiry-volume-over-time chart — bucketing helpers. Buckets are local
// calendar days/weeks(Monday-start)/months, gap-filled between the first
// and last bucket that actually has data so a quiet stretch shows as a dip
// to zero rather than a skipped gap in the line.
const VOLUME_GRANULARITIES = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function volumeBucketKey(date, granularity) {
  if (granularity === "month") {
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  }
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (granularity === "week") {
    const isoDay = (d.getDay() + 6) % 7; // 0 = Monday
    d.setDate(d.getDate() - isoDay);
  }
  return d.getTime();
}

function volumeNextBucket(ts, granularity) {
  const d = new Date(ts);
  if (granularity === "week") d.setDate(d.getDate() + 7);
  else if (granularity === "month") d.setMonth(d.getMonth() + 1);
  else d.setDate(d.getDate() + 1);
  return d.getTime();
}

function volumeBucketLabel(ts, granularity) {
  const d = new Date(ts);
  if (granularity === "month") return d.toLocaleDateString("en-PH", { month: "short", year: "2-digit" });
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function buildVolumeBuckets(inquiries, granularity) {
  const counts = new Map();
  let minKey = Infinity;
  let maxKey = -Infinity;
  inquiries.forEach((inq) => {
    if (!inq.createdAt) return;
    const key = volumeBucketKey(inq.createdAt.toDate(), granularity);
    counts.set(key, (counts.get(key) || 0) + 1);
    if (key < minKey) minKey = key;
    if (key > maxKey) maxKey = key;
  });
  if (minKey === Infinity) return [];
  const buckets = [];
  let cursor = minKey;
  while (cursor <= maxKey) {
    buckets.push({ ts: cursor, count: counts.get(cursor) || 0 });
    cursor = volumeNextBucket(cursor, granularity);
  }
  return buckets;
}

export default function DashboardPage() {
  const { user, isAdmin, dealer, roleChecked, canManageInquiries, isDealerOwner, isDealerStaff, dealersBySlug } =
    useDashboard();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [staffByUid, setStaffByUid] = useState({}); // uid -> staff display name, owner only
  const [overdueVisibleCount, setOverdueVisibleCount] = useState(OVERDUE_PAGE_SIZE);
  const [newStatusInquiries, setNewStatusInquiries] = useState([]); // admin only, see effect below
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("all"); // "all" or a dealerSlug
  const [windowSize, setWindowSize] = useState(WINDOW_SIZE);
  const [volumeGranularity, setVolumeGranularity] = useState("day");
  const [volumeHoverIndex, setVolumeHoverIndex] = useState(null);

  useEffect(() => {
    setOverdueVisibleCount(OVERDUE_PAGE_SIZE);
    // The volume chart's bucket array reshapes whenever the scoped
    // inquiries change (date range/partner filter) — a stale hover index
    // would otherwise point at the wrong bucket until the next mousemove.
    setVolumeHoverIndex(null);
  }, [dateRangeFilter, partnerFilter]);

  useEffect(() => {
    if (!roleChecked || !isDealerOwner || !dealer?.slug) return;
    // Live, not a one-time getDocs — an owner who adds/removes staff in
    // another tab should see the assign-staff dropdown here update without
    // needing a full reload.
    const q = query(collection(db, "dealers"), where("slug", "==", dealer.slug));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const map = {};
        snap.forEach((d) => {
          const data = d.data();
          if (isStaffDealerDoc(data)) map[d.id] = data.name || data.email;
        });
        setStaffByUid(map);
      },
      logIfUnexpected
    );
    return () => unsubscribe();
  }, [roleChecked, isDealerOwner, dealer]);

  useEffect(() => {
    if (!roleChecked) return;
    if (isAdmin && !canManageInquiries) return;
    if (!isAdmin && !dealer?.slug) {
      setLoadingInquiries(false);
      return;
    }
    if (isDealerStaff && !user?.uid) {
      setLoadingInquiries(false);
      return;
    }

    // A staff account can only read inquiries actually assigned to it (see
    // firestore.rules) — the query itself has to be scoped to
    // assignedStaff==uid, not just dealerSlug, otherwise Firestore denies
    // the WHOLE query the moment it'd return even one document the staff
    // account isn't allowed to read. No orderBy here (would need a new
    // assignedStaff+createdAt composite index) — sorted client-side below
    // instead, which is fine for one staff member's small list.
    const q = isAdmin
      ? query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(windowSize))
      : isDealerStaff
      ? query(collection(db, "inquiries"), where("assignedStaff", "==", user.uid))
      : query(
          collection(db, "inquiries"),
          where("dealerSlug", "==", dealer.slug),
          orderBy("createdAt", "desc"),
          limit(windowSize)
        );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (isDealerStaff) {
          docs = docs.sort(
            (a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
          );
        }
        setInquiries(docs);
        setLoadingInquiries(false);
      },
      (err) => {
        logIfUnexpected(err);
        setLoadingInquiries(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, isAdmin, dealer, canManageInquiries, isDealerStaff, user, windowSize]);

  // Dedicated to "Needs attention" — the main inquiries listener above is
  // windowed (limit(windowSize)) to the most RECENT N, which is exactly
  // wrong for finding the OLDEST still-"New" leads once total volume
  // exceeds that window. A plain equality filter on status (no orderBy, no
  // limit) needs no new composite index — Firestore combines multiple
  // equality filters on different fields automatically — and the "New"
  // bucket is naturally bounded to leads not yet processed, not the whole
  // collection's history. Admin-only: the owner/staff render branch below
  // has no "Needs attention" UI, so there's nothing for a dealer-scoped
  // version of this listener to feed.
  useEffect(() => {
    if (!roleChecked || !isAdmin) {
      setNewStatusInquiries([]);
      return;
    }
    if (!canManageInquiries) return;

    const q = query(collection(db, "inquiries"), where("status", "==", "new"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setNewStatusInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      logIfUnexpected
    );
    return () => unsubscribe();
  }, [roleChecked, isAdmin, canManageInquiries]);

  const handleStatusChange = async (inquiryId, status) => {
    try {
      const inquiryRef = doc(db, "inquiries", inquiryId);
      // Read the live doc instead of trusting locally cached `inquiries`
      // state — two tabs/users acting on the same lead could otherwise
      // race: this client's onSnapshot update hasn't landed yet, so its
      // stale cache still thinks firstContactedAt is unset and re-stamps
      // it with a later timestamp, corrupting the avg-time-to-contact stat.
      const liveSnap = await getDoc(inquiryRef);
      const current = liveSnap.exists() ? liveSnap.data() : null;
      const isFirstContact =
        current && (current.status || "new") === "new" && status !== "new" && !current.firstContactedAt;
      await updateDoc(inquiryRef, {
        status,
        updatedAt: serverTimestamp(),
        ...(isFirstContact ? { firstContactedAt: serverTimestamp() } : {}),
      });
    } catch (err) {
      // Unlike the passive onSnapshot listeners elsewhere in this file,
      // this is a user-initiated write — a permission-denied here is a
      // real, actionable rejection (e.g. assigning an already-removed
      // staff member, which firestore.rules now rejects), not an expected
      // logout race. Must not be silently swallowed via logIfUnexpected.
      console.error(err);
    }
  };

  const handleAssignStaff = async (inquiryId, staffUid) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        assignedStaff: staffUid,
        // Only stamp "when assigned" on an actual assignment — "Unassigned"
        // (staffUid === "") clears it instead, so it doesn't look like a
        // real assignment event to anything reading this field later.
        assignedStaffAt: staffUid ? serverTimestamp() : deleteField(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // All memoized so the volume chart's unthrottled mousemove hover updates
  // (setVolumeHoverIndex) don't re-run this whole aggregation on every
  // pixel of cursor movement — only an actual change to the underlying
  // inquiries/filters does. Each returns a cheap default when !isAdmin,
  // since this page's other branch (dealer/staff) never reads them.
  const cutoffMs = useMemo(() => dateRangeCutoffMs(dateRangeFilter), [dateRangeFilter]);

  const scopedInquiries = useMemo(() => {
    if (!isAdmin) return [];
    return inquiries.filter((inq) => {
      if (partnerFilter !== "all" && inq.dealerSlug !== partnerFilter) return false;
      if (cutoffMs !== null && (!inq.createdAt || inq.createdAt.toMillis() < cutoffMs)) return false;
      return true;
    });
  }, [isAdmin, inquiries, partnerFilter, cutoffMs]);

  const stageStats = useMemo(() => {
    if (!isAdmin) return null;
    const countByStage = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
    const wonByDealer = {};
    const totalByDealer = {};
    let contactedCount = 0;
    let totalContactMs = 0;
    scopedInquiries.forEach((inq) => {
      const status = inq.status || "new";
      countByStage[status] = (countByStage[status] || 0) + 1;
      totalByDealer[inq.dealerSlug] = (totalByDealer[inq.dealerSlug] || 0) + 1;
      if (status === "won") {
        wonByDealer[inq.dealerSlug] = (wonByDealer[inq.dealerSlug] || 0) + 1;
      }
      if (inq.firstContactedAt && inq.createdAt) {
        contactedCount += 1;
        totalContactMs += inq.firstContactedAt.toMillis() - inq.createdAt.toMillis();
      }
    });
    return {
      countByStage,
      wonByDealer,
      totalByDealer,
      avgContactMs: contactedCount > 0 ? totalContactMs / contactedCount : null,
    };
  }, [isAdmin, scopedInquiries]);

  // Deliberately ignores the date-range filter (only the partner filter
  // applies) — its whole purpose is surfacing stale "New" leads, so a
  // narrow range like "Today" must not hide exactly the old, neglected
  // ones it exists to catch.
  const overdue = useMemo(() => {
    if (!isAdmin) return [];
    const now = Date.now();
    const list = [];
    newStatusInquiries.forEach((inq) => {
      if (partnerFilter !== "all" && inq.dealerSlug !== partnerFilter) return;
      if (inq.createdAt) {
        const ageMs = now - inq.createdAt.toMillis();
        if (ageMs > DAY_MS) list.push({ ...inq, ageMs });
      }
    });
    list.sort((a, b) => b.ageMs - a.ageMs);
    return list;
  }, [isAdmin, newStatusInquiries, partnerFilter]);

  const topPartners = useMemo(() => {
    if (!isAdmin || !stageStats) return [];
    return Object.keys(stageStats.totalByDealer)
      .map((slug) => ({
        slug,
        company: dealersBySlug[slug] || slug,
        won: stageStats.wonByDealer[slug] || 0,
        total: stageStats.totalByDealer[slug],
      }))
      .sort((a, b) => b.won - a.won || b.total - a.total)
      .slice(0, 5);
  }, [isAdmin, stageStats, dealersBySlug]);

  const volumeBuckets = useMemo(() => {
    if (!isAdmin) return [];
    return buildVolumeBuckets(scopedInquiries, volumeGranularity);
  }, [isAdmin, scopedInquiries, volumeGranularity]);

  if (!roleChecked || (isAdmin && !canManageInquiries)) {
    return <main className="page-center">Loading...</main>;
  }

  if (isAdmin) {
    const { countByStage, avgContactMs } = stageStats;
    const clampedHoverIndex =
      volumeHoverIndex !== null && volumeHoverIndex < volumeBuckets.length ? volumeHoverIndex : null;

    return (
      <div className="dashboard dashboard-wide">
        <div className="posts-header">
          <h2>Overview</h2>
          <Link href="/dashboard/inquiries" className="btn-primary posts-new-btn" style={{ textAlign: "center" }}>
            View all inquiries
          </Link>
        </div>

        <div className="overview-filter-bar">
          <select
            className="location-filter-select"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            {DATE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            className="location-filter-select"
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
          >
            <option value="all">All partners</option>
            {Object.entries(dealersBySlug)
              .sort((a, b) => (a[1] || "").localeCompare(b[1] || ""))
              .map(([slug, company]) => (
                <option key={slug} value={slug}>
                  {company}
                </option>
              ))}
          </select>
        </div>

        {!loadingInquiries && inquiries.length === windowSize && (
          <p className="window-note">
            Only the most recent {windowSize} inquiries are loaded, so the stats
            and charts below may undercount for the selected date range —{" "}
            <button type="button" className="window-note-link" onClick={() => setWindowSize((w) => w + WINDOW_SIZE)}>
              Load older inquiries
            </button>{" "}
            to widen them.
          </p>
        )}

        {loadingInquiries ? (
          <p>Loading overview...</p>
        ) : (
          <>
            {scopedInquiries.length === 0 ? (
              <div className="overview-section">
                <div className="empty-state">
                  <h2>No data</h2>
                  <p>No inquiries match the selected date range and partner.</p>
                </div>
              </div>
            ) : (
              <div className="overview-bento">
                <div className="stat-card stat-card-hero bento-hero-1">
                  <span className="stat-number">{scopedInquiries.length}</span>
                  <span className="stat-label">Total inquiries</span>
                </div>

                <div className="stat-card stat-card-hero bento-hero-2">
                  <span className="stat-number">
                    {avgContactMs !== null ? formatDuration(avgContactMs) : "—"}
                  </span>
                  <span className="stat-label">Avg. time to contact</span>
                </div>

                <div
                  className={`attention-banner attention-banner-compact bento-attention${
                    overdue.length === 0 ? " attention-banner-empty" : ""
                  }`}
                >
                  <div className="attention-banner-header">
                    <span className="attention-banner-icon" aria-hidden="true">
                      {overdue.length === 0 ? "✓" : "⚠"}
                    </span>
                    <h3>Needs attention</h3>
                    {overdue.length > 0 && <span className="attention-banner-count">{overdue.length}</span>}
                  </div>
                  {overdue.length === 0 ? (
                    <p className="attention-banner-empty-text">No data — nothing needs attention right now.</p>
                  ) : (
                    <div className="attention-banner-scroll">
                      {overdue.slice(0, overdueVisibleCount).map((inq) => (
                        <div key={inq.id} className="attention-item">
                          <strong>{inq.name}</strong>
                          <span className="inquiry-preview">
                            {dealersBySlug[inq.dealerSlug] || inq.dealerSlug} · still New, waiting{" "}
                            {formatDuration(inq.ageMs)}
                          </span>
                        </div>
                      ))}
                      {overdueVisibleCount < overdue.length && (
                        <button
                          type="button"
                          className="see-more-btn"
                          onClick={() => setOverdueVisibleCount((c) => c + OVERDUE_PAGE_SIZE)}
                        >
                          See more ({overdue.length - overdueVisibleCount} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="overview-section bento-rings">
                  <h3>Pipeline split</h3>
                  <div className="stage-ring-row">
                    {STAGES.map((s) => {
                      const count = countByStage[s.value] || 0;
                      const share = count / scopedInquiries.length;
                      const r = 36;
                      const circumference = 2 * Math.PI * r;
                      const dash = share * circumference;
                      const icon = s.value === "won" ? " ✓" : s.value === "lost" ? " ✕" : "";
                      return (
                        <div
                          key={s.value}
                          className="stage-ring"
                          style={{ "--ring-color": STAGE_COLORS[s.value] }}
                        >
                          <svg viewBox="0 0 90 90" className="stage-ring-svg">
                            <circle cx={45} cy={45} r={r} className="stage-ring-track" strokeWidth={10} fill="none" />
                            <circle
                              cx={45}
                              cy={45}
                              r={r}
                              fill="none"
                              stroke={STAGE_COLORS[s.value]}
                              strokeWidth={10}
                              strokeLinecap="round"
                              strokeDasharray={`${dash} ${circumference}`}
                              transform="rotate(-90 45 45)"
                              tabIndex={0}
                              aria-label={`${s.label}: ${count} inquir${count === 1 ? "y" : "ies"} (${Math.round(
                                share * 100
                              )}%)`}
                            >
                              <title>{`${s.label}: ${count} (${Math.round(share * 100)}%)`}</title>
                            </circle>
                            <text x={45} y={50} textAnchor="middle" className="stage-ring-value">
                              {Math.round(share * 100)}%
                            </text>
                          </svg>
                          <span className="stage-ring-label">
                            {s.label}
                            {icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="overview-section bento-volume">
                  <div className="volume-chart-header">
                    <h3>Inquiry volume</h3>
                    <select
                      className="location-filter-select"
                      value={volumeGranularity}
                      onChange={(e) => {
                        setVolumeGranularity(e.target.value);
                        setVolumeHoverIndex(null);
                      }}
                    >
                      {VOLUME_GRANULARITIES.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {volumeBuckets.length > 0 &&
                    (() => {
                      const W = 600;
                      const H = 200;
                      const n = volumeBuckets.length;
                      const maxCount = Math.max(...volumeBuckets.map((b) => b.count), 1);
                      const yMax = maxCount * 1.15;
                      const xFor = (i) => (n === 1 ? W / 2 : (i / (n - 1)) * W);
                      const yFor = (count) => H - (count / yMax) * H;
                      const points = volumeBuckets.map((b, i) => [xFor(i), yFor(b.count)]);
                      const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
                      const areaPath = `${linePath} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;
                      const labelIdxs =
                        n <= 3 ? volumeBuckets.map((_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1];
                      const hover = clampedHoverIndex !== null ? volumeBuckets[clampedHoverIndex] : null;
                      const hoverX = clampedHoverIndex !== null ? xFor(clampedHoverIndex) : null;
                      const hoverY = clampedHoverIndex !== null ? yFor(volumeBuckets[clampedHoverIndex].count) : null;
                      return (
                        <div
                          className="volume-chart"
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pct = (e.clientX - rect.left) / rect.width;
                            const idx = Math.min(n - 1, Math.max(0, Math.round(pct * (n - 1))));
                            setVolumeHoverIndex(idx);
                          }}
                          onMouseLeave={() => setVolumeHoverIndex(null)}
                        >
                          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="volume-chart-svg">
                            <defs>
                              <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                              <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} className="volume-chart-grid" />
                            ))}
                            <path d={areaPath} fill="url(#volumeFill)" stroke="none" />
                            <path
                              d={linePath}
                              fill="none"
                              stroke="var(--brand-blue)"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {hoverX !== null && (
                              <>
                                <line x1={hoverX} x2={hoverX} y1={0} y2={H} className="volume-chart-crosshair" />
                                <circle
                                  cx={hoverX}
                                  cy={hoverY}
                                  r={4}
                                  fill="var(--brand-blue)"
                                  stroke="var(--card-bg)"
                                  strokeWidth={2}
                                />
                              </>
                            )}
                          </svg>
                          <div className="volume-chart-labels">
                            {labelIdxs.map((i) => (
                              <span
                                key={i}
                                className="volume-chart-label"
                                style={{ left: `${(xFor(i) / W) * 100}%` }}
                              >
                                {volumeBucketLabel(volumeBuckets[i].ts, volumeGranularity)}
                              </span>
                            ))}
                          </div>
                          {hover && (
                            <div className="volume-chart-tooltip" style={{ left: `${(hoverX / W) * 100}%` }}>
                              <strong>{hover.count}</strong> {hover.count === 1 ? "inquiry" : "inquiries"}
                              <br />
                              {volumeBucketLabel(hover.ts, volumeGranularity)}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                </div>

                <div className="overview-section bento-stage">
                  <h3>By stage</h3>
                  <div className="stat-grid stat-grid-compact">
                    {STAGES.map((s) => (
                      <div key={s.value} className={`stat-card stat-card-compact stat-card-${s.value}`}>
                        <span className="stat-number">{countByStage[s.value] || 0}</span>
                        <span className="stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-section bento-partners">
                  <h3>Top partners</h3>
                  {(() => {
                    const maxTotal = Math.max(...topPartners.map((p) => p.total), 1);
                    return topPartners.map((p) => (
                      <div key={p.slug} className="partner-rank-item">
                        <div className="partner-rank-row">
                          <strong>{p.company}</strong>
                          <span className="inquiry-preview">
                            {p.won} won · {p.total} total
                          </span>
                        </div>
                        <div className="partner-rank-bar-track">
                          <div
                            className="partner-rank-bar-fill"
                            style={{ width: `${Math.max((p.total / maxTotal) * 100, 4)}%` }}
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {isDealerOwner && !loadingInquiries && inquiries.length === windowSize && (
        <p className="window-note">
          Showing the most recent {windowSize} inquiries —{" "}
          <button type="button" className="window-note-link" onClick={() => setWindowSize((w) => w + WINDOW_SIZE)}>
            Load older inquiries
          </button>{" "}
          to search further back.
        </p>
      )}

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
            staffByUid={isDealerOwner ? staffByUid : undefined}
            onAssignStaff={isDealerOwner ? handleAssignStaff : undefined}
            onDownloadAttachment={downloadInquiryAttachment}
          />
        ))
      )}
    </div>
  );
}
