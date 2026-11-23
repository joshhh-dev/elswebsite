import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { withAuth } from "@/lib/apiAuth";
import { isStaffDealerDoc } from "@/lib/dealerRoles";

// Recovery action for the gap flagged alongside the custom-claims migration
// (see firestore.rules): nothing stops someone from hand-creating a
// dealers/{uid} doc outside /api/dealers and /api/dealer-staff, which would
// leave it without the dealerRole/dealerSlug claims firestore.rules needs —
// that account's dashboard would silently show empty (permission-denied is
// swallowed as an assumed logout race). Re-running this re-derives claims
// for every dealers doc from its current Firestore fields, so it's always
// safe to click again.
export async function POST(req) {
  return withAuth(req, requireDeveloper, async () => {
    try {
      const snap = await adminDb.collection("dealers").get();

      // One bad/orphaned doc (e.g. its Auth user was deleted directly,
      // leaving the Firestore doc behind) must not fail the whole batch —
      // that would defeat this endpoint's own purpose as a recovery tool
      // for everyone else's accounts. Isolate each doc's own try/catch
      // instead of a single Promise.all.
      const results = await Promise.allSettled(
        snap.docs.map(async (d) => {
          const data = d.data();
          if (!data.slug) {
            return { status: "skipped", id: d.id };
          }
          await adminAuth.setCustomUserClaims(d.id, {
            dealerRole: isStaffDealerDoc(data) ? "staff" : "owner",
            dealerSlug: data.slug,
          });
          return { status: "synced", id: d.id };
        })
      );

      let synced = 0;
      let skipped = 0;
      const failed = [];
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          failed.push({ id: snap.docs[i].id, error: r.reason?.message || "Unknown error" });
        } else if (r.value.status === "synced") {
          synced += 1;
        } else {
          skipped += 1;
        }
      });
      if (failed.length) {
        console.error("Dealer claims sync — per-doc failures:", failed);
      }

      return Response.json({ success: true, synced, skipped, failed: failed.length, total: snap.size });
    } catch (err) {
      console.error("Dealer claims sync error:", err);
      return Response.json({ error: "Failed to sync claims." }, { status: 500 });
    }
  });
}
