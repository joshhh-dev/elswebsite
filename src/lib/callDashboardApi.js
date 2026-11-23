import { auth } from "@/lib/firebase";

// Shared bearer-token fetch wrapper for every /dashboard page that calls
// its own authenticated API route (staff, dealer-staff, dealers) — same
// shape, same error handling, previously copy-pasted three times. `body`
// is optional (e.g. a GET with the request encoded in the URL's query
// string instead) — fetch throws if a GET/HEAD request is given a body at
// all, even `undefined`, so it's only attached when actually provided.
export async function callDashboardApi(path, body, method = "POST") {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    ...(body !== undefined && body !== null ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

// Fetches a short-lived signed URL for a downloadable inquiry attachment
// (see /api/inquiry-attachment) and opens it directly — attachments live in
// Storage, which has no public/client-readable rule for this path (see
// storage.rules), so every download goes through this authenticated route
// rather than a direct Storage SDK read.
export async function downloadInquiryAttachment(inquiryId) {
  const { url } = await callDashboardApi(
    `/api/inquiry-attachment?inquiryId=${encodeURIComponent(inquiryId)}`,
    null,
    "GET"
  );
  window.open(url, "_blank", "noopener,noreferrer");
}
