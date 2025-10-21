const BRAND_COLOR = "#339674";
const BRAND_GRADIENT = "linear-gradient(135deg, #339674 0%, #23785d 100%)";
const TEXT_COLOR = "#1f2933";

const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    background-color: #f5f7fa;
    color: ${TEXT_COLOR};
    font-family: 'Questrial', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  a {
    color: ${BRAND_COLOR};
  }
`;

export function renderEmailLayout({
  previewText = "",
  heroTitle,
  heroSubtitle,
  bodyHtml,
  cta,
  footerHtml,
}) {
  const preview = previewText
    ? `<span style="display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0;">${previewText}</span>`
    : "";

  const ctaBlock = cta
    ? `
        <tr>
          <td align="center" style="padding: 32px 32px 24px;">
            <a
              href="${cta.url}"
              style="
                display: inline-block;
                text-decoration: none;
                background: ${BRAND_GRADIENT};
                color: #ffffff;
                padding: 14px 28px;
                border-radius: 999px;
                font-weight: 600;
                letter-spacing: 0.02em;
                box-shadow: 0 12px 24px rgba(51, 150, 116, 0.25);
              "
            >
              ${cta.label}
            </a>
          </td>
        </tr>`
    : "";

  const subtitleBlock = heroSubtitle
    ? `<p style="margin: 12px 0 0; font-size: 16px; line-height: 1.6; color: #ccc;">${heroSubtitle}</p>`
    : "";

  const footer = footerHtml
    ? footerHtml
    : `<p style="margin: 0; color: #9aa5b1; font-size: 12px;">
         You’re receiving this email because your address is registered with Natalie Segal Admin.
       </p>`;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${heroTitle}</title>
    <style>
      ${baseStyles}
    </style>
  </head>
  <body style="margin:0; padding:32px 0; background-color:#f5f7fa;">
    ${preview}
    <table role="presentation" width="100%" border="0" cellPadding="0" cellSpacing="0" style="font-family:inherit;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" border="0" cellPadding="0" cellSpacing="0" style="background-color:#ffffff; border-radius:28px; overflow:hidden; box-shadow:0 25px 60px rgba(31,41,51,0.08);">
            <tr>
              <td style="padding:48px 32px 32px; text-align:center; background:${BRAND_GRADIENT}; color:#ffffff;">
                <p style="margin:0 0 12px; font-size:14px; letter-spacing:0.4em; text-transform:uppercase; opacity:0.8;">
                  Natalie Segal
                </p>
                <h1 style="margin:0; font-size:32px; line-height:1.25;">${heroTitle}</h1>
                ${subtitleBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 0;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="font-size:16px; line-height:1.7; color:${TEXT_COLOR};">
                  <tr>
                    <td>
                      ${bodyHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${ctaBlock}
            <tr>
              <td style="padding: 0 32px 40px;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="font-size:14px; line-height:1.6; color:#556070;">
                  <tr>
                    <td style="border-top:1px solid #e5e9f2; padding-top:24px; text-align:center;">
                      ${footer}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0; font-size:12px; color:#94a3b8;">
            © ${new Date().getFullYear()} Natalie Segal. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
