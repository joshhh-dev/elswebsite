import { adminDb, adminBucket } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { matchDealer } from "@/lib/matchDealer";

const VALID_INQUIRY_TYPES = ["general", "purchase_order", "design_request", "quotation"];

// One-time attachment only (no later "request more files" flow) — the
// customer attaches a PO/design file right on the form, if at all. Kept
// deliberately tight: these are the file types a PO/design request would
// realistically come in, not a general-purpose upload box.
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

// Used by the per-product inquiry forms (LG, Scarpavapor, ProLS, LAC, LMS).
// Unlike /api/rbpn-inquiry (where the customer already picked a specific
// dealer card), here only a location name is given — this route figures out
// which dealer to assign via matchDealer() (exact area match, or nearest by
// distance), tags the inquiry with the product, and writes it to the same
// Firestore "inquiries" collection the dealer portal already reads from.
// multipart/form-data, not JSON, so an optional file (`attachment`) can ride
// along with the rest of the fields in one request.
export async function POST(req) {
  let formData;
  try {
    formData = await req.formData();
  } catch (parseError) {
    console.error("Invalid request body:", parseError);
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");
  const product = formData.get("product");
  const productItem = formData.get("productItem");
  const location = formData.get("location");
  const inquiryType = formData.get("inquiryType");
  const attachmentFile = formData.get("attachment");

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

  const hasAttachment =
    attachmentFile && typeof attachmentFile === "object" && attachmentFile.size > 0;
  if (hasAttachment) {
    if (attachmentFile.size > MAX_ATTACHMENT_BYTES) {
      return new Response(
        JSON.stringify({ success: false, error: "Attachment is too large (max 10MB)." }),
        { status: 400 }
      );
    }
    if (!ALLOWED_ATTACHMENT_TYPES.has(attachmentFile.type)) {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported attachment file type." }),
        { status: 400 }
      );
    }
  }

  // Reserved up front (not written yet) so the attachment's Storage path can
  // be keyed on the real inquiry id instead of a throwaway temp id.
  const inquiryRef = adminDb.collection("inquiries").doc();
  let attachmentMeta = null;

  if (hasAttachment) {
    try {
      const buffer = Buffer.from(await attachmentFile.arrayBuffer());
      const safeName = attachmentFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-100);
      const storagePath = `inquiry-attachments/${inquiryRef.id}/${safeName}`;
      await adminBucket.file(storagePath).save(buffer, {
        contentType: attachmentFile.type,
        metadata: { cacheControl: "private, max-age=0" },
      });
      attachmentMeta = {
        path: storagePath,
        name: attachmentFile.name,
        contentType: attachmentFile.type,
        size: attachmentFile.size,
      };
    } catch (storageError) {
      console.error("Inquiry attachment upload failed:", storageError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to upload attachment." }),
        { status: 500 }
      );
    }
  }

  try {
    await inquiryRef.set({
      dealerSlug: match.dealer.slug,
      product,
      ...(productItem ? { productItem } : {}),
      inquiryType: VALID_INQUIRY_TYPES.includes(inquiryType) ? inquiryType : "general",
      location,
      name,
      email,
      phone: phone || "",
      message: message || "",
      ...(attachmentMeta ? { attachment: attachmentMeta } : {}),
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (firestoreError) {
    console.error("Firestore inquiry write error:", firestoreError);
    // The attachment (if any) already landed in Storage with no doc ever
    // referencing it — best-effort clean it up instead of leaving it
    // orphaned forever (nothing else ever revisits this path).
    if (attachmentMeta) {
      await adminBucket
        .file(attachmentMeta.path)
        .delete()
        .catch((err) => console.error("Orphaned attachment cleanup also failed:", err));
    }
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }

  // Denormalized so the admin Inquiries page's location/product filter
  // dropdowns stay complete regardless of its windowed inquiries query (see
  // firestore.rules' metadata/inquiryFilters comment) — a value seen once
  // stays in these arrays even after the inquiry that first introduced it
  // falls outside the window. Deliberately NOT in the same try/catch as the
  // inquiry write above: a failure here must never turn the response into
  // `success: false`, since the inquiry itself is already saved by this
  // point — doing so would make the customer think their submission didn't
  // go through and resubmit, creating a duplicate inquiry. Still awaited
  // (not fire-and-forget): on a serverless deploy the function's execution
  // context can be frozen right after the Response is returned, so an
  // unawaited write here could simply never complete.
  try {
    await adminDb
      .collection("metadata")
      .doc("inquiryFilters")
      .set({ locations: FieldValue.arrayUnion(location), products: FieldValue.arrayUnion(product) }, { merge: true });
  } catch (err) {
    console.error("Inquiry filter metadata update failed (non-fatal):", err);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
