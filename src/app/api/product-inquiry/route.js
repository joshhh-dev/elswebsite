import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { matchDealer } from "@/lib/matchDealer";

// Used by the per-product inquiry forms (LG, Scarpavapor, ProLS, LAC, LMS).
// Unlike /api/rbpn-inquiry (where the customer already picked a specific
// dealer card), here only a location name is given — this route figures out
// which dealer to assign via matchDealer() (exact area match, or nearest by
// distance), tags the inquiry with the product, and writes it to the same
// Firestore "inquiries" collection the dealer portal already reads from.
export async function POST(req) {
  let name, email, phone, message, product, location;
  try {
    ({ name, email, phone, message, product, location } = await req.json());
  } catch (parseError) {
    console.error("Invalid request body:", parseError);
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  if (!name || !email || !product || !location) {
    return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
      status: 400,
    });
  }

  const match = matchDealer(location);
  if (!match) {
    return new Response(
      JSON.stringify({ success: false, error: "Unrecognized location" }),
      { status: 400 }
    );
  }

  try {
    await adminDb.collection("inquiries").add({
      dealerSlug: match.dealer.slug,
      product,
      location,
      name,
      email,
      phone: phone || "",
      message: message || "",
      contacted: false,
      done: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (firestoreError) {
    console.error("Firestore inquiry write error:", firestoreError);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
