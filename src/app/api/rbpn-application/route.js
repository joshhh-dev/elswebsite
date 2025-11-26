import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { full_name, business_name, email, phone, address, dealer_type, intent } = await req.json();

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
        <h2>RBPN Dealer Application</h2>
        <p><strong>Full Name:</strong> ${full_name}</p>
        <p><strong>Business Name:</strong> ${business_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business Address:</strong> ${address}</p>
        <p><strong>Dealer Type:</strong> ${dealer_type}</p>
        <p><strong>Intent:</strong></p>
        <p>${intent}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("RBPN Email error:", err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
