import { adminDb } from "@/lib/firebaseAdmin";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { sendPasswordLinkEmail } from "@/lib/staffEmail";

export async function POST(req) {
  try {
    await requireDeveloper(req);
  } catch (err) {
    return Response.json({ error: err.message || "Unauthorized" }, { status: err.status || 401 });
  }

  let uid;
  try {
    ({ uid } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!uid) {
    return Response.json({ error: "uid is required" }, { status: 400 });
  }

  try {
    const snap = await adminDb.collection("admins").doc(uid).get();
    if (!snap.exists || !snap.data().email) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    await sendPasswordLinkEmail(snap.data().email, { isNewAccount: false });
    return Response.json({ success: true });
  } catch (err) {
    console.error("Staff password reset error:", err);
    return Response.json({ error: "Failed to send reset email." }, { status: 500 });
  }
}
