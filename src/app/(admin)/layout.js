// Wraps /login and /dashboard — kept out of the public (site) route group
// so neither gets the marketing Header/Footer (dashboard/layout.js below
// provides its own topbar/nav instead). Admin area, so it stays out of
// search engines even though it's served from the same public domain.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-portal">{children}</div>;
}
