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

export const STAGES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted/Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const stageLabel = (status) => STAGES.find((s) => s.value === status)?.label || "New";
export const isClosed = (status) => status === "won" || status === "lost";

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
          <div className="inquiry-actions" onClick={(e) => e.stopPropagation()}>
            {isClosed(status) ? (
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
                  .sort((a, b) => a[1].localeCompare(b[1]))
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
        </div>
      )}
    </div>
  );
}
