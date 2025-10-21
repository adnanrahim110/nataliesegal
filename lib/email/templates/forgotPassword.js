import { renderEmailLayout, stripHtml } from "./layout.js";

export function buildForgotPasswordEmail({ name, resetUrl }) {
  const safeName = name ? name.split(" ")[0] : "there";
  const subject = "Reset your Natalie Segal admin password";
  const body = `
    <p style="margin:0 0 16px;">Hi ${safeName},</p>
    <p style="margin:0 0 16px;">
      We received a request to reset the password for your Natalie Segal admin account.
      If you made this request, click the button below to choose a new password. This link
      will expire in <strong>60 minutes</strong>.
    </p>
    <p style="margin:0 0 16px;">
      If you didn’t request a password reset, you can safely ignore this message—your login
      credentials will stay the same.
    </p>
  `;

  const footer = `
    <p style="margin:0; color:#94a3b8; font-size:12px;">
      Having trouble? Copy and paste this link into your browser:<br />
      <a href="${resetUrl}" style="color:#339674;">${resetUrl}</a>
    </p>
  `;

  const html = renderEmailLayout({
    previewText: "Reset your Natalie Segal admin password.",
    heroTitle: "Reset your password",
    heroSubtitle: "Securely update your credentials in minutes.",
    bodyHtml: body,
    cta: {
      label: "Create a new password",
      url: resetUrl,
    },
    footerHtml: footer,
  });

  const text = stripHtml(
    `Hi ${safeName},\n\nWe received a request to reset the password for your Natalie Segal admin account.\n\nUse this link (valid for 60 minutes): ${resetUrl}\n\nIf you didn’t request this, you can ignore the email.\n`
  );

  return { subject, html, text };
}
