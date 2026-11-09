import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ELS Philippines Inc.",
  description: "Start your laundry business like a veteran.",
};

// Intentionally bare — the public site's chrome (Header/Footer + nav data
// fetch) lives in (site)/layout.js instead, so /dashboard and /login (which
// sit outside that route group) don't get the marketing Header/Footer.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
        {children}
      </body>
    </html>
  );
}
