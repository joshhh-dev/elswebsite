// app/api/rbpn-application/route.js
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const {
      full_name,
      business_name,
      email,
      phone,
      address,
      dealer_type,
      message,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: `New RBPN Dealer Application from ${full_name}`,
      html: `
        <h3>New RBPN Dealer Application</h3>
        <p><strong>Full Name:</strong> ${full_name}</p>
        <p><strong>Business Name:</strong> ${business_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Dealer Type:</strong> ${dealer_type}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Dealer application email error:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
