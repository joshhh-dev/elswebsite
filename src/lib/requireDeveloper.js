import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

// Shared auth check for every /api/staff* route: verifies the caller's
// Firebase ID token (sent as "Authorization: Bearer <idToken>") and
// confirms their admins/{uid} doc has role "developer". Throws a
// Response-friendly error object ({ status, message }) on any failure, so
// callers can just `catch` and return it directly.
export async function requireDeveloper(req) {
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

  const adminSnap = await adminDb.collection("admins").doc(decoded.uid).get();
  if (!adminSnap.exists || adminSnap.data().role !== "developer") {
    throw { status: 403, message: "Developer access required" };
  }

  return decoded.uid;
}
