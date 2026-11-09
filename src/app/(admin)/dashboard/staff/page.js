"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin (Inquiries + Publishing)" },
  { value: "developer", label: "Developer (everything + staff)" },
  { value: "inquiries", label: "Inquiries only" },
  { value: "publisher", label: "Publisher only" },
];

const roleLabel = (role) => ROLE_OPTIONS.find((r) => r.value === (role || "admin"))?.label || role;

async function callStaffApi(path, body, method = "POST") {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

function AddStaffForm({ onAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("inquiries");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSaving(true);
    setError("");
    try {
      await callStaffApi("/api/staff", { email: trimmed, role });
      setEmail("");
      setRole("inquiries");
      onAdded();
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
        <label htmlFor="staffRole">Role</label>
        <select id="staffRole" value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <p className="subtitle" style={{ margin: "0 0 12px" }}>
        They`&apos;`ll get an email to set their own password — no password is created or shared here.
      </p>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary posts-new-btn" type="submit" disabled={saving}>
        {saving ? "Adding..." : "+ Add Staff"}
      </button>
    </form>
  );
}

function StaffRow({ account, isSelf, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = async (e) => {
    const role = e.target.value;
    setBusy(true);
    setError("");
    try {
      await callStaffApi("/api/staff/role", { uid: account.id, role }, "PATCH");
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async () => {
    setBusy(true);
    setError("");
    try {
      await callStaffApi("/api/staff/reset-password", { uid: account.id });
      alert(`Password reset email sent to ${account.email}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${account.email}? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await callStaffApi("/api/staff", { uid: account.id }, "DELETE");
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="post-list-item" style={{ cursor: "default", flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <strong>{account.email || account.id}</strong>
        {isSelf && <span className="dealer-tag">You</span>}
        {error && <p className="error-text">{error}</p>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {isSelf ? (
          <span className="status-badge status-on">{roleLabel(account.role)}</span>
        ) : (
          <select value={account.role || "admin"} onChange={handleRoleChange} disabled={busy}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="status-toggle-btn"
          onClick={handleResetPassword}
          disabled={busy}
        >
          Send password reset
        </button>
        {!isSelf && (
          <button type="button" className="danger-btn" onClick={handleRemove} disabled={busy}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function StaffPage() {
  const router = useRouter();
  const { roleChecked, canManageStaff, user } = useDashboard();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleChecked && !canManageStaff) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canManageStaff, router]);

  useEffect(() => {
    if (!roleChecked || !canManageStaff) return;
    const q = query(collection(db, "admins"), orderBy("email"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAccounts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [roleChecked, canManageStaff]);

  if (!roleChecked || !canManageStaff) {
    return <main className="page-center">Loading...</main>;
  }

  return (
    <div className="dashboard">
      <AddStaffForm onAdded={() => {}} />

      <div className="posts-header">
        <h2>Staff</h2>
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <h2>No staff accounts yet</h2>
          <p>Add your first staff account above.</p>
        </div>
      ) : (
        accounts.map((account) => (
          <StaffRow
            key={account.id}
            account={account}
            isSelf={account.id === user?.uid}
            onChanged={() => {}}
          />
        ))
      )}
    </div>
  );
}
