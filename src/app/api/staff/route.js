import { randomUUID } from "crypto";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { sendPasswordLinkEmail } from "@/lib/staffEmail";

const VALID_ROLES = ["admin", "developer", "inquiries", "publisher"];

function randomTempPassword() {
  // Never stored or returned — the account is activated via the emailed
  // password-reset link instead, so this just satisfies Firebase Auth's
  // "email/password accounts need a password" requirement at creation.
  return randomUUID() + randomUUID();
}

export async function POST(req) {
  try {
    await requireDeveloper(req);
  } catch (err) {
    return Response.json({ error: err.message || "Unauthorized" }, { status: err.status || 401 });
  }

  let email, role;
  try {
    ({ email, role } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  email = (email || "").trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password: randomTempPassword(),
    });

    await adminDb.collection("admins").doc(userRecord.uid).set({
      email,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    await sendPasswordLinkEmail(email, { isNewAccount: true });

    return Response.json({ success: true, uid: userRecord.uid });
  } catch (err) {
    console.error("Staff create error:", err);
    const message = err.code === "auth/email-already-exists" ? "That email is already in use." : "Failed to create account.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req) {
  let callerUid;
  try {
    callerUid = await requireDeveloper(req);
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
  if (uid === callerUid) {
    return Response.json({ error: "You can't remove your own account." }, { status: 400 });
  }

  try {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("admins").doc(uid).delete();
    return Response.json({ success: true });
  } catch (err) {
    console.error("Staff delete error:", err);
    return Response.json({ error: "Failed to remove account." }, { status: 500 });
  }
}
