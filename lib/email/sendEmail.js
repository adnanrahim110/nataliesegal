import { getTransporter, getDefaultFrom } from "./transporter.js";

export async function sendEmail({ to, subject, html, text, headers = {} }) {
  if (!to) throw new Error("Missing recipient email address.");
  if (!subject) throw new Error("Missing email subject.");
  if (!html && !text) throw new Error("Email requires html or text content.");

  const transporter = await getTransporter();
  const from = getDefaultFrom();

  const mailOptions = {
    from,
    to,
    subject,
    html,
    text,
    headers,
  };

  return transporter.sendMail(mailOptions);
}
