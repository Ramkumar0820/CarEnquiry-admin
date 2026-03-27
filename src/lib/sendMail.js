import nodemailer from "nodemailer";

export const sendMail = async ({ subject, html, to }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BC_SMTP_HOST,
    port: Number(process.env.BC_SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.BC_SMTP_USER,
      pass: process.env.BC_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Madurai SRM Tourism & Travels" <${process.env.BC_SMTP_FROM}>`,
    to: to || process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};


