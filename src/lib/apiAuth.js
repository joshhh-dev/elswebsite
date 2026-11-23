// Shared wrapper for the "verify caller, then run the handler" shape
// repeated at the top of every /api/staff, /api/dealer-staff, and
// /api/dealers route. requireFn is requireDeveloper or requireDealerOwner
// — both throw a { status, message } object on failure, which this turns
// into the same JSON error response every route previously built by hand.
export async function withAuth(req, requireFn, handler) {
  let authResult;
  try {
    authResult = await requireFn(req);
  } catch (err) {
    return Response.json({ error: err.message || "Unauthorized" }, { status: err.status || 401 });
  }
  return handler(authResult);
}
