"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import { logIfUnexpected } from "@/lib/logIfUnexpected";
import { callDashboardApi } from "@/lib/callDashboardApi";
import { isStaffDealerDoc } from "@/lib/dealerRoles";

// A dealer "owner" account's own staff roster — the dealer-level mirror of
// dashboard/staff/page.js (which manages admins/{uid} for ELS staff). An
// owner creates/removes staff sub-accounts here; staff accounts never see
// this page (see the isOwner guard below and dashboard/layout.js's nav).

function AddStaffForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) return;
    setSaving(true);
    setError("");
    try {
      await callDashboardApi("/api/dealer-staff", { name: name.trim(), email: trimmedEmail, password });
      setName("");
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
        <h3 style={{ margin: 0 }}>Add Staff</h3>
      </div>
      <div className="field">
        <label htmlFor="staffName">Name</label>
        <input
          id="staffName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan Dela Cruz"
        />
      </div>
      <div className="field">
        <label htmlFor="staffEmail">Email</label>
        <input
          id="staffEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@company.com"
        />
      </div>
      <div className="field">
        <label htmlFor="staffPassword">Password</label>
        <input
          id="staffPassword"
          type="text"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
      </div>
      <p className="subtitle" style={{ margin: "0 0 12px" }}>
        You&apos;re setting this password yourself — give it to your staff member directly (they
        won&apos;t receive any email).
      </p>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary posts-new-btn" type="submit" disabled={saving}>
        {saving ? "Adding..." : "+ Add Staff"}
      </button>
    </form>
  );
}

function StaffRow({ account }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    const password = prompt(`New password for ${account.name || account.email} (at least 6 characters):`);
    if (!password) return;
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await callDashboardApi("/api/dealer-staff/reset-password", { uid: account.id, password });
      alert(`Password updated for ${account.email}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${account.name || account.email}? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await callDashboardApi("/api/dealer-staff", { uid: account.id }, "DELETE");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="post-list-item" style={{ cursor: "default", flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <strong>{account.name || account.email}</strong>
        <span className="inquiry-preview"> {account.email}</span>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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

export default function MyStaffPage() {
  const router = useRouter();
  const { roleChecked, isAdmin, dealer, isDealerOwner: isOwner } = useDashboard();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleChecked && (isAdmin || !isOwner)) {
      router.replace("/dashboard");
    }
  }, [roleChecked, isAdmin, isOwner, router]);

  useEffect(() => {
    if (!roleChecked || isAdmin || !isOwner || !dealer?.slug) return;
    const q = query(collection(db, "dealers"), where("slug", "==", dealer.slug));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const staff = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((d) => isStaffDealerDoc(d));
        setAccounts(staff);
        setLoading(false);
      },
      (err) => {
        logIfUnexpected(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, isAdmin, isOwner, dealer]);

  if (!roleChecked || isAdmin || !isOwner) {
    return <main className="page-center">Loading...</main>;
  }

  return (
    <div className="dashboard">
      <AddStaffForm />

      <div className="posts-header">
        <h2>My Staff</h2>
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <h2>No staff accounts yet</h2>
          <p>Add your first staff account above to start assigning prospects to them.</p>
        </div>
      ) : (
        accounts.map((account) => <StaffRow key={account.id} account={account} />)
      )}
    </div>
  );
}
