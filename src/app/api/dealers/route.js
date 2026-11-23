import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { withAuth } from "@/lib/apiAuth";
import { isOwnerDealerDoc } from "@/lib/dealerRoles";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Admin-managed CRUD for RBPN dealer OWNER accounts (not staff — those stay
// owner-managed via /api/dealer-staff). This only creates/edits the
// login/Firestore+Auth side (dealers/{uid} + the dealerRole/dealerSlug
// custom claims firestore.rules relies on) — it does NOT make a partner
// "live" on the public site. Routing/matchDealer() and the /rbpn/{slug}
// pages read from src/lib/rbpnDealers.js, a separate static file that
// still needs a manual code change + deploy for a new partner to actually
// appear there.
export async function POST(req) {
  return withAuth(req, requireDeveloper, async () => {
    let email, password, company, slug;
    try {
      ({ email, password, company, slug } = await req.json());
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    email = (email || "").trim().toLowerCase();
    company = (company || "").trim();
    slug = (slug || "").trim().toLowerCase();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!company) {
      return Response.json({ error: "Company name is required" }, { status: 400 });
    }
    if (!slug || !SLUG_PATTERN.test(slug)) {
      return Response.json(
        { error: "Slug must be lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    let existingSlugSnap;
    try {
      existingSlugSnap = await adminDb.collection("dealers").where("slug", "==", slug).get();
    } catch (err) {
      console.error("Dealer create error (slug check):", err);
      return Response.json({ error: "Failed to create account." }, { status: 500 });
    }
    const hasExistingOwner = existingSlugSnap.docs.some((d) => isOwnerDealerDoc(d.data()));
    if (hasExistingOwner) {
      return Response.json({ error: "That slug already has an owner account." }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({ email, password });
    } catch (err) {
      console.error("Dealer create error:", err);
      const message = err.code === "auth/email-already-exists" ? "That email is already in use." : "Failed to create account.";
      return Response.json({ error: message }, { status: 500 });
    }

    // Independent of each other (both just need the new uid) — run in
    // parallel instead of two sequential round-trips, but Auth and
    // Firestore aren't a single transaction: if either fails, best-effort
    // delete the just-created Auth user instead of leaving a half-
    // provisioned account with no repair path other than the "Sync
    // account permissions" button (which can't fix a MISSING Firestore
    // doc, only missing claims).
    const results = await Promise.allSettled([
      adminDb.collection("dealers").doc(userRecord.uid).set({
        slug,
        company,
        email,
        createdAt: FieldValue.serverTimestamp(),
      }),
      // Mirrors the staff-creation claims (see /api/dealer-staff) —
      // firestore.rules checks request.auth.token.dealerRole/dealerSlug
      // directly, not a get() on this doc (see firestore.rules'
      // comments).
      adminAuth.setCustomUserClaims(userRecord.uid, { dealerRole: "owner", dealerSlug: slug }),
    ]);

    const failed = results.find((r) => r.status === "rejected");
    if (failed) {
      console.error("Dealer create error (post-Auth, rolling back):", failed.reason);
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

export async function PATCH(req) {
  return withAuth(req, requireDeveloper, async () => {
    let uid, company;
    try {
      ({ uid, company } = await req.json());
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    company = (company || "").trim();
    if (!uid) {
      return Response.json({ error: "uid is required" }, { status: 400 });
    }
    if (!company) {
      return Response.json({ error: "Company name is required" }, { status: 400 });
    }

    try {
      const targetRef = adminDb.collection("dealers").doc(uid);
      const targetSnap = await targetRef.get();
      const target = targetSnap.exists ? targetSnap.data() : null;
      if (!isOwnerDealerDoc(target)) {
        return Response.json({ error: "Owner account not found." }, { status: 404 });
      }

      // Staff docs cache a copy of the owner's company name for display —
      // keep them in sync so they don't go stale.
      const staffSnap = await adminDb
        .collection("dealers")
        .where("slug", "==", target.slug)
        .where("role", "==", "staff")
        .get();

      await Promise.all([
        targetRef.update({ company }),
        ...staffSnap.docs.map((d) => d.ref.update({ company })),
      ]);

      return Response.json({ success: true });
    } catch (err) {
      console.error("Dealer update error:", err);
      return Response.json({ error: "Failed to update account." }, { status: 500 });
    }
  });
}

export async function DELETE(req) {
  return withAuth(req, requireDeveloper, async () => {
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
      if (!isOwnerDealerDoc(target)) {
        return Response.json({ error: "Owner account not found." }, { status: 404 });
      }

      const staffSnap = await adminDb
        .collection("dealers")
        .where("slug", "==", target.slug)
        .where("role", "==", "staff")
        .get();
      if (!staffSnap.empty) {
        return Response.json(
          { error: "Remove this partner's staff accounts first." },
          { status: 400 }
        );
      }

      // Independent of each other — run in parallel.
      await Promise.all([adminAuth.deleteUser(uid), adminDb.collection("dealers").doc(uid).delete()]);
      return Response.json({ success: true });
    } catch (err) {
      console.error("Dealer delete error:", err);
      return Response.json({ error: "Failed to remove account." }, { status: 500 });
    }
  });
}
