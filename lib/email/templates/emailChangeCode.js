import { renderEmailLayout, stripHtml } from "./layout.js";

export function buildEmailChangeCodeEmail({
  name,
  code,
  newEmail,
  expiresMinutes = 10,
}) {
  const safeName = name ? name.split(" ")[0] : "there";
  const subject = "Confirm your email change request";

  const body = `
    <p style="margin:0 0 16px;">Hi ${safeName},</p>
    <p style="margin:0 0 16px;">
      You recently requested to change the email address on your Natalie Segal admin account.
      To make sure it was really you, enter the verification code below in the dashboard. The code expires
      in <strong>${expiresMinutes} minutes</strong>.
    </p>
    <div style="
        margin:24px 0;
        padding:20px;
        border-radius:18px;
        background:rgba(51, 150, 116, 0.08);
        border:1px solid rgba(51, 150, 116, 0.2);
        text-align:center;
        font-size:28px;
        letter-spacing:0.4em;
        font-weight:700;
        color:#23785d;
    ">
      ${code}
    </div>
    <p style="margin:0 0 16px;">
      Once confirmed, we’ll update your sign-in email to <strong>${newEmail}</strong>.
      If you didn’t make this request, please secure your account immediately by updating your password.
    </p>
  `;

  const footer = `
    <p style="margin:0; color:#94a3b8; font-size:12px;">
      This code is valid for ${expiresMinutes} minutes. After it expires, you’ll need to request a new one from the profile settings page.
    </p>
  `;

  const html = renderEmailLayout({
    previewText: "Confirm your new admin email address.",
    heroTitle: "Verify your new email",
    heroSubtitle: "Enter this code to finish updating your profile email.",
    bodyHtml: body,
    cta: null,
    footerHtml: footer,
  });

  const text = stripHtml(
    `Hi ${safeName},\n\nUse this verification code to confirm your new email (${newEmail}): ${code}\nThe code expires in ${expiresMinutes} minutes.\nIf you didn't request this, secure your account immediately.\n`
  );

  return { subject, html, text };
}
