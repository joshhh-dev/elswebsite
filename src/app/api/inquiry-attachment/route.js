import { adminAuth, adminDb, adminBucket } from "@/lib/firebaseAdmin";

const SIGNED_URL_TTL_MS = 5 * 60 * 1000;

// Inquiry attachments (see /api/product-inquiry) live in Storage with no
// client-readable rule (storage.rules default-denies everything outside
// posts/**) — access instead goes through this route, which re-derives the
// SAME access a dealer/admin would have on the inquiry doc itself (mirrors
// dealerCanAccessInquiry/adminRoleAllows in firestore.rules, just in JS,
// since Storage rules can't easily share that logic) before minting a
// short-lived signed URL.
export async function GET(req) {
  const authHeader = req.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return Response.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return Response.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const inquiryId = searchParams.get("inquiryId");
  if (!inquiryId) {
    return Response.json({ error: "inquiryId is required" }, { status: 400 });
  }

  const inquirySnap = await adminDb.collection("inquiries").doc(inquiryId).get();
  if (!inquirySnap.exists) {
    return Response.json({ error: "Inquiry not found" }, { status: 404 });
  }
  const inquiry = inquirySnap.data();
  if (!inquiry.attachment?.path) {
    return Response.json({ error: "This inquiry has no attachment" }, { status: 404 });
  }

  const dealerRole = decoded.dealerRole;
  const dealerSlug = decoded.dealerSlug;
  let authorized =
    (dealerRole === "owner" && dealerSlug === inquiry.dealerSlug) ||
    (dealerRole === "staff" && inquiry.assignedStaff === decoded.uid);

  if (!authorized) {
    const adminSnap = await adminDb.collection("admins").doc(decoded.uid).get();
    if (adminSnap.exists) {
      const role = adminSnap.data().role;
      authorized = !role || role === "admin" || role === "developer" || role === "inquiries";
    }
  }

  if (!authorized) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [url] = await adminBucket.file(inquiry.attachment.path).getSignedUrl({
      action: "read",
      expires: Date.now() + SIGNED_URL_TTL_MS,
    });
    return Response.json({ url });
  } catch (err) {
    console.error("Failed to sign inquiry attachment URL:", err);
    return Response.json({ error: "Failed to generate download link." }, { status: 500 });
  }
}
