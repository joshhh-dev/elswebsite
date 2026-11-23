"use client";

// Shared by the dealer's own inquiry list (dashboard/page.js) and the
// admin's full list (dashboard/inquiries/page.js). An inquiry moves through
// a pipeline — New -> Contacted -> Quoted/Negotiating -> Won/Lost — via
// `status`, the only field a dealer/admin is allowed to write (see
// firestore.rules). Won/Lost are terminal: once set, the stage selector is
// replaced by a locked badge + a "Reopen" button (resets to "contacted").
//
// `onReassign`/`dealersBySlug` are admin-only (passed by
// dashboard/inquiries/page.js): lets the admin move a prospect to a
// different RBPN partner (dealerSlug). A dealer's own view never passes
// these, so the control simply doesn't render there.
//
// `onAssignStaff`/`staffByUid` are dealer-owner-only (passed by
// dashboard/page.js): lets the owner assign/reassign a prospect to one of
// their own staff sub-accounts. A staff account's own view never passes
// these, so the control simply doesn't render there either.

export const STAGES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted/Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const stageLabel = (status) => STAGES.find((s) => s.value === status)?.label || "New";
export const isClosed = (status) => status === "won" || status === "lost";

// Single source of truth for each stage's color — used for the stat-card
// top border, the pipeline-split rings, and the status filter buttons
// (dashboard pages + globals.css) so a stage reads as the same color
// everywhere. Deliberately NOT the exact hexes CSS used to hardcode per
// context (those had drifted out of sync); validated for colorblind-safe
// adjacency (dataviz skill) — won/lost rely on an icon or label alongside
// color, never color alone, since that pair can't be made CVD-distinct on
// its own.
export const STAGE_COLORS = {
  new: "#6b7280",
  contacted: "#1d4ed8",
  quoted: "#b45309",
  won: "#0ca30c",
  lost: "#d03b3b",
};

// Set once by the customer on the product-page inquiry form (ProductInquiryForm.js
// / /api/product-inquiry) — what kind of request this is, not which product.
export const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "purchase_order", label: "Purchase Order Request" },
  { value: "design_request", label: "Design Request" },
  { value: "quotation", label: "Quotation Request" },
];
export const inquiryTypeLabel = (value) =>
  INQUIRY_TYPES.find((t) => t.value === value)?.label || "General Inquiry";

export function formatDate(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function InquiryCard({
  inquiry,
  expanded,
  onToggleExpand,
  onStatusChange,
  showDealer,
  dealerName,
  dealersBySlug,
  onReassign,
  staffByUid,
  onAssignStaff,
  onDownloadAttachment,
}) {
  const preview =
    inquiry.message.length > 100 ? inquiry.message.slice(0, 100) + "…" : inquiry.message;
  const status = inquiry.status || "new";

  return (
    <div className="inquiry-card">
      <div className="inquiry-summary" onClick={onToggleExpand} role="button" tabIndex={0}>
        <div className="inquiry-summary-main">
          <strong>{inquiry.name}</strong>
          {showDealer && <span className="dealer-tag">{dealerName || inquiry.dealerSlug}</span>}
          {inquiry.product && <span className="product-tag">{inquiry.product}</span>}
          {inquiry.productItem && (
            <span className="product-item-tag">{inquiry.productItem}</span>
          )}
          {inquiry.inquiryType && inquiry.inquiryType !== "general" && (
            <span className="inquiry-type-tag">{inquiryTypeLabel(inquiry.inquiryType)}</span>
          )}
          <p className="inquiry-preview">{expanded ? "" : preview}</p>
        </div>
        <div className="inquiry-summary-side">
          <span className={`status-badge status-stage-${status}`}>{stageLabel(status)}</span>
          <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
        </div>
      </div>

      {expanded && (
        <div className="inquiry-detail">
          {inquiry.message && <p className="inquiry-message-full">{inquiry.message}</p>}
          <p className="inquiry-contact-line">
            {inquiry.email} · {inquiry.phone}
            {inquiry.location && ` · ${inquiry.location}`}
          </p>
          {inquiry.attachment && (
            <p className="inquiry-contact-line">
              📎{" "}
              <button
                type="button"
                className="window-note-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadAttachment?.(inquiry.id);
                }}
              >
                {inquiry.attachment.name}
              </button>
            </p>
          )}
          <div className="inquiry-actions" onClick={(e) => e.stopPropagation()}>
            {!onStatusChange ? (
              // Admin view (dashboard/inquiries/page.js): ELS only routes a
              // prospect to the right RBPN partner (see the reassign
              // dropdown below) — the partner/staff working the lead is
              // who actually moves it through the pipeline, so status here
              // is read-only.
              <span className={`status-badge status-stage-${status}`}>{stageLabel(status)}</span>
            ) : isClosed(status) ? (
              <>
                <span className={`status-badge status-stage-${status}`}>
                  {stageLabel(status)} — closed
                </span>
                <button
                  type="button"
                  className="status-toggle-btn"
                  onClick={() => onStatusChange(inquiry.id, "contacted")}
                >
                  Reopen
                </button>
              </>
            ) : (
              <select value={status} onChange={(e) => onStatusChange(inquiry.id, e.target.value)}>
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {onReassign && dealersBySlug && (
            <div className="inquiry-reassign" onClick={(e) => e.stopPropagation()}>
              <label htmlFor={`reassign-${inquiry.id}`}>Assigned to:</label>
              <select
                id={`reassign-${inquiry.id}`}
                value={inquiry.dealerSlug}
                onChange={(e) => onReassign(inquiry.id, e.target.value)}
              >
                {Object.entries(dealersBySlug)
                  .sort((a, b) => (a[1] || "").localeCompare(b[1] || ""))
                  .map(([slug, company]) => (
                    <option key={slug} value={slug}>
                      {company}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {inquiry.reassignedFrom && dealersBySlug?.[inquiry.reassignedFrom] && (
            <p className="inquiry-reassign-note">
              Reassigned from {dealersBySlug[inquiry.reassignedFrom]}
            </p>
          )}

          {onAssignStaff && staffByUid && (
            <div className="inquiry-reassign" onClick={(e) => e.stopPropagation()}>
              <label htmlFor={`assign-staff-${inquiry.id}`}>Assigned staff:</label>
              {Object.keys(staffByUid).length === 0 ? (
                <span className="subtitle">No staff accounts yet.</span>
              ) : (
                <select
                  id={`assign-staff-${inquiry.id}`}
                  value={inquiry.assignedStaff || ""}
                  onChange={(e) => onAssignStaff(inquiry.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {Object.entries(staffByUid)
                    .sort((a, b) => (a[1] || "").localeCompare(b[1] || ""))
                    .map(([uid, name]) => (
                      <option key={uid} value={uid}>
                        {name}
                      </option>
                    ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
