"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import { logIfUnexpected } from "@/lib/logIfUnexpected";
import { callDashboardApi as callDealersApi } from "@/lib/callDashboardApi";
import { isOwnerDealerDoc } from "@/lib/dealerRoles";

// Admin-managed CRUD for RBPN dealer OWNER accounts (login/Firestore+Auth
// only — see src/app/api/dealers/route.js for the full scope note on how
// this relates to src/lib/rbpnDealers.js, the separate static source for
// the public-facing /rbpn/{slug} pages and inquiry routing).

function AddDealerForm() {
  const [company, setCompany] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !company.trim() || !slug.trim() || password.length < 6) return;
    setSaving(true);
    setError("");
    try {
      await callDealersApi("/api/dealers", {
        email: trimmedEmail,
        password,
        company: company.trim(),
        slug: slug.trim(),
      });
      setCompany("");
      setSlug("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="post-editor" style={{ marginBottom: 24 }} onSubmit={handleSubmit}>
      <div className="posts-header">
        <h3 style={{ margin: 0 }}>Add RBPN Account</h3>
      </div>
      <div className="field">
        <label htmlFor="dealerCompany">Company</label>
        <input
          id="dealerCompany"
          type="text"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name"
        />
      </div>
      <div className="field">
        <label htmlFor="dealerSlug">Slug</label>
        <input
          id="dealerSlug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. manila, cebu, ilo-ilo"
        />
      </div>
      <div className="field">
        <label htmlFor="dealerEmail">Email</label>
        <input
          id="dealerEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="owner@company.com"
        />
      </div>
      <div className="field">
        <label htmlFor="dealerPassword">Password</label>
        <input
          id="dealerPassword"
          type="text"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
      </div>
      <p className="subtitle" style={{ margin: "0 0 12px" }}>
        This creates the login only — give the password to the partner directly (no email is
        sent). Making them appear on the public site/inquiry routing is a separate step.
      </p>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary posts-new-btn" type="submit" disabled={saving}>
        {saving ? "Adding..." : "+ Add RBPN Account"}
      </button>
    </form>
  );
}

function DealerRow({ account }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleEditCompany = async () => {
    const company = prompt("Company name:", account.company || "");
    if (!company || !company.trim() || company.trim() === account.company) return;
    setBusy(true);
    setError("");
    try {
      await callDealersApi("/api/dealers", { uid: account.id, company: company.trim() }, "PATCH");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async () => {
    const password = prompt(`New password for ${account.company} (at least 6 characters):`);
    if (!password) return;
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await callDealersApi("/api/dealers/reset-password", { uid: account.id, password });
      alert(`Password updated for ${account.email}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${account.company}? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await callDealersApi("/api/dealers", { uid: account.id }, "DELETE");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="post-list-item" style={{ cursor: "default", flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <strong>{account.company}</strong>
        <span className="dealer-tag">{account.slug}</span>
        <p className="inquiry-preview">{account.email}</p>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="status-toggle-btn" onClick={handleEditCompany} disabled={busy}>
          Edit company
        </button>
        <button type="button" className="status-toggle-btn" onClick={handleResetPassword} disabled={busy}>
          Reset password
        </button>
        <button type="button" className="danger-btn" onClick={handleRemove} disabled={busy}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default function DealersPage() {
  const router = useRouter();
  const { roleChecked, canManageStaff } = useDashboard();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const handleSyncClaims = async () => {
    setSyncing(true);
    try {
      const result = await callDealersApi("/api/dealers/sync-claims", {});
      alert(
        `Synced ${result.synced} account(s)` +
          (result.skipped ? `, skipped ${result.skipped} with no slug` : "") +
          (result.failed ? `, ${result.failed} failed — check server logs` : "") +
          "."
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (roleChecked && !canManageStaff) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canManageStaff, router]);

  useEffect(() => {
    if (!roleChecked || !canManageStaff) return;
    const q = query(collection(db, "dealers"), orderBy("company"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const owners = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((d) => isOwnerDealerDoc(d));
        setAccounts(owners);
        setLoading(false);
      },
      (err) => {
        logIfUnexpected(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, canManageStaff]);

  if (!roleChecked || !canManageStaff) {
    return <main className="page-center">Loading...</main>;
  }

  return (
    <div className="dashboard">
      <AddDealerForm />

      <div className="posts-header">
        <h2>Accounts</h2>
        <button type="button" className="status-toggle-btn" onClick={handleSyncClaims} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync account permissions"}
        </button>
      </div>
      <p className="subtitle" style={{ margin: "0 0 20px" }}>
        Only needed if an account was ever created outside this page (e.g. directly in Firebase
        Console) — re-derives each account&apos;s access from its current Firestore data. Safe to
        run anytime.
      </p>

      {loading ? (
        <p>Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <h2>No RBPN accounts yet</h2>
          <p>Add your first partner account above.</p>
        </div>
      ) : (
        accounts.map((account) => <DealerRow key={account.id} account={account} />)
      )}
    </div>
  );
}
