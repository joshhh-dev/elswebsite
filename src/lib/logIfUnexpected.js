import { auth } from "@/lib/firebase";

// Shared by every dashboard page's onSnapshot/getDocs error callback.
// Clicking "Log out" can race an in-flight read/listener: Firestore denies
// it the instant auth clears, which is expected (not a real bug). But a
// permission-denied while the user is STILL signed in (auth.currentUser
// still set) is a genuine rejection — e.g. a dealer account missing its
// custom claims (see firestore.rules) — and must not be silently
// discarded, or the page just looks broken/empty with no visible error.
export function logIfUnexpected(err) {
  if (err?.code === "permission-denied" && !auth?.currentUser) return;
  console.error(err);
}
