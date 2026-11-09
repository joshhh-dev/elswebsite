import nodemailer from "nodemailer";
import { adminAuth } from "@/lib/firebaseAdmin";

// Shared by both /api/staff (new account) and /api/staff/reset-password —
// emails a Firebase-generated password-reset/setup link to a staff member.
// Same transporter pattern as src/app/api/send-email/route.js.
export async function sendPasswordLinkEmail(email, { isNewAccount }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const link = await adminAuth.generatePasswordResetLink(email);

  const subject = isNewAccount
    ? "Your ELS Philippines dashboard account"
    : "Reset your ELS Philippines dashboard password";
  const intro = isNewAccount
    ? "An account was created for you on the ELS Philippines dashboard. Set your password to get started:"
    : "A password reset was requested for your ELS Philippines dashboard account:";

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    html: `
      <h3>${subject}</h3>
      <p>${intro}</p>
      <p><a href="${link}">${link}</a></p>
      <p>If you didn't expect this, you can ignore this email.</p>
    `,
  });
}
