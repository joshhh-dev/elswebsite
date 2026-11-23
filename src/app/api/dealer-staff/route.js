import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireDealerOwner } from "@/lib/requireDealerOwner";
import { withAuth } from "@/lib/apiAuth";
import { isStaffDealerDoc } from "@/lib/dealerRoles";

export async function POST(req) {
  return withAuth(req, requireDealerOwner, async (owner) => {
    let email, name, password;
    try {
      ({ email, name, password } = await req.json());
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    email = (email || "").trim().toLowerCase();
    name = (name || "").trim();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({ email, password });
    } catch (err) {
      console.error("Dealer staff create error:", err);
      const message = err.code === "auth/email-already-exists" ? "That email is already in use." : "Failed to create account.";
      return Response.json({ error: message }, { status: 500 });
    }

    // Independent of each other (both just need the new uid) — run in
    // parallel instead of two sequential round-trips, but Auth and
    // Firestore aren't a single transaction: if either fails, best-effort
    // delete the just-created Auth user instead of leaving a half-
    // provisioned account (no profile doc, or no claims — either way
    // firestore.rules would deny this account every read) with no repair
    // path (unlike owner accounts, which have /api/dealers/sync-claims).
    const results = await Promise.allSettled([
      adminDb.collection("dealers").doc(userRecord.uid).set({
        slug: owner.slug,
        company: owner.company,
        role: "staff",
        ownerUid: owner.uid,
        name,
        email,
        createdAt: FieldValue.serverTimestamp(),
      }),
      // Mirrored onto the ID token so firestore.rules can check
      // request.auth.token.dealerSlug directly — a list query's security
      // rule can only be verified against its own where() filters, not a
      // get() lookup of this account's Firestore doc (see firestore.rules'
      // comments on dealerCanAccessInquiry), so the slug has to live on
      // the token too.
      adminAuth.setCustomUserClaims(userRecord.uid, { dealerRole: "staff", dealerSlug: owner.slug }),
    ]);

    const failed = results.find((r) => r.status === "rejected");
    if (failed) {
      console.error("Dealer staff create error (post-Auth, rolling back):", failed.reason);
      // Either write could have been the one that succeeded — roll back
      // BOTH (the doc delete is a harmless no-op if it was never written).
      await Promise.all([
        adminAuth.deleteUser(userRecord.uid).catch((err) => console.error("Rollback auth delete also failed:", err)),
        adminDb.collection("dealers").doc(userRecord.uid).delete().catch((err) => console.error("Rollback doc delete also failed:", err)),
      ]);
      return Response.json({ error: "Failed to create account." }, { status: 500 });
    }

    return Response.json({ success: true, uid: userRecord.uid });
  });
}

export async function DELETE(req) {
  return withAuth(req, requireDealerOwner, async (owner) => {
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
      const targetSnap = await adminDb.collection("dealers").doc(uid).get();
      const target = targetSnap.exists ? targetSnap.data() : null;
      if (!isStaffDealerDoc(target) || target.slug !== owner.slug) {
        return Response.json({ error: "Staff account not found." }, { status: 404 });
      }

      // Clear this uid from any inquiries still pointing at it — otherwise
      // a removed staff member's old leads silently become unreachable (no
      // current staff account matches the stale uid) while the owner's UI
      // just shows them as misleadingly "Unassigned".
      const assignedSnap = await adminDb
        .collection("inquiries")
        .where("assignedStaff", "==", uid)
        .get();
      const clearAssignments = Promise.all(
        assignedSnap.docs.map((d) =>
          d.ref.update({
            assignedStaff: FieldValue.delete(),
            assignedStaffAt: FieldValue.delete(),
            updatedAt: FieldValue.serverTimestamp(),
          })
        )
      );

      // Independent of each other — run in parallel.
      await Promise.all([clearAssignments, adminAuth.deleteUser(uid), adminDb.collection("dealers").doc(uid).delete()]);
      return Response.json({ success: true });
    } catch (err) {
      console.error("Dealer staff delete error:", err);
      return Response.json({ error: "Failed to remove account." }, { status: 500 });
    }
  });
}
