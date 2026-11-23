// Server-only Firebase Admin SDK init — used by API routes to write RBPN
// inquiries into Firestore (the "elsphilippines" project, shared with the
// separate RBPN Dealer Portal) so dealers can see their own leads there.
//
// Never import this from a client component — it uses a private service
// account key (env vars only, never committed).

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
// Used for inquiry attachments (see /api/product-inquiry and
// /api/inquiry-attachment) — uploaded/read only via this Admin SDK bucket,
// never through client-side Storage rules (storage.rules default-denies
// everything outside posts/**, so there's nothing to open up there).
export const adminBucket = getStorage(app).bucket();
