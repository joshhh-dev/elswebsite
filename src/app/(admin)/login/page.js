"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFirebaseConfigured) {
      setError(
        "Login isn't working yet (this portal is still a placeholder — Firebase config/dealer accounts haven't been set up)."
      );
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Wrong email or password, or no account has been set up for this yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-center">
      <form className="card" onSubmit={handleSubmit}>
        <span className="badge">Placeholder — not live yet</span>
        <h1 style={{ marginTop: 12 }}>RBPN Dealer Portal</h1>
        <p className="subtitle">
          Log in to see the inquiries assigned to your dealer account.
        </p>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dealer@company.com"
            suppressHydrationWarning
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            suppressHydrationWarning
          />
        </div>

        <button className="btn-primary" type="submit" disabled={loading} suppressHydrationWarning>
          {loading ? "Logging in..." : "Log In"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </main>
  );
}
