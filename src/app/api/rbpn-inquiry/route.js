// app/api/inquiry/route.js
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  let user_name, user_email, message, dealerSlug, phone;
  try {
    ({ user_name, user_email, message, dealerSlug, phone } = await req.json());
  } catch (parseError) {
    console.error("Invalid request body:", parseError);
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  if (!dealerSlug) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  try {
    await adminDb.collection("inquiries").add({
      dealerSlug,
      name: user_name,
      email: user_email,
      phone: phone || "",
      message,
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
