import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { isOwnerDealerDoc } from "@/lib/dealerRoles";

// Shared auth check for every /api/dealer-staff* route: verifies the
// caller's Firebase ID token and confirms their dealers/{uid} doc has no
// role (today's pre-existing accounts) or role "owner" — a dealer staff
// sub-account can never manage other staff. Throws a Response-friendly
// error object ({ status, message }) on any failure, so callers can just
// `catch` and return it directly.
export async function requireDealerOwner(req) {
  const authHeader = req.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    throw { status: 401, message: "Missing Authorization header" };
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch (err) {
    throw { status: 401, message: "Invalid or expired session" };
  }

  const dealerSnap = await adminDb.collection("dealers").doc(decoded.uid).get();
  const data = dealerSnap.exists ? dealerSnap.data() : null;
  if (!isOwnerDealerDoc(data)) {
    throw { status: 403, message: "Dealer owner access required" };
  }

  return { uid: decoded.uid, slug: data.slug, company: data.company };
}
