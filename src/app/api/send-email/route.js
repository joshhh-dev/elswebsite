import nodemailer from "nodemailer";


export async function POST(req) {
  try {
    const { user_name, user_email, message } = await req.json();

    // Configure your mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: user_email,
      to: process.env.GMAIL_USER, // where you’ll receive the inquiry
      subject: `New Inquiry from ${user_name}`,
      text: message,
      html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
