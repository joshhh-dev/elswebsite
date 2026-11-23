import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { requireDealerOwner } from "@/lib/requireDealerOwner";
import { withAuth } from "@/lib/apiAuth";
import { isStaffDealerDoc } from "@/lib/dealerRoles";

export async function POST(req) {
  return withAuth(req, requireDealerOwner, async (owner) => {
    let uid, password;
    try {
      ({ uid, password } = await req.json());
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!uid) {
      return Response.json({ error: "uid is required" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    try {
      const snap = await adminDb.collection("dealers").doc(uid).get();
      const data = snap.exists ? snap.data() : null;
      if (!isStaffDealerDoc(data) || data.slug !== owner.slug) {
        return Response.json({ error: "Staff account not found." }, { status: 404 });
      }
      await adminAuth.updateUser(uid, { password });
      return Response.json({ success: true });
    } catch (err) {
      console.error("Dealer staff password reset error:", err);
      return Response.json({ error: "Failed to update password." }, { status: 500 });
    }
  });
}
