// Server-only Firebase Admin SDK init — used by API routes to write RBPN
// inquiries into Firestore (the "elsphilippines" project, shared with the
// separate RBPN Dealer Portal) so dealers can see their own leads there.
//
// Never import this from a client component — it uses a private service
// account key (env vars only, never committed).

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
