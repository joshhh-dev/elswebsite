import { adminDb } from "@/lib/firebaseAdmin";
import { requireDeveloper } from "@/lib/requireDeveloper";

const VALID_ROLES = ["admin", "developer", "inquiries", "publisher"];

export async function PATCH(req) {
  let callerUid;
  try {
    callerUid = await requireDeveloper(req);
  } catch (err) {
    return Response.json({ error: err.message || "Unauthorized" }, { status: err.status || 401 });
  }

  let uid, role;
  try {
    ({ uid, role } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!uid || !VALID_ROLES.includes(role)) {
    return Response.json({ error: "uid and a valid role are required" }, { status: 400 });
  }
  if (uid === callerUid) {
    return Response.json({ error: "You can't change your own role." }, { status: 400 });
  }

  try {
    await adminDb.collection("admins").doc(uid).update({ role });
    return Response.json({ success: true });
  } catch (err) {
    console.error("Staff role update error:", err);
    return Response.json({ error: "Failed to update role." }, { status: 500 });
  }
}
