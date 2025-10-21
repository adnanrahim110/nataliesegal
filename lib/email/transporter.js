import nodemailer from "nodemailer";

let cachedTransporter = null;

function normalizePassword(pass) {
  return (pass || "").replace(/\s+/g, "");
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === "false"
      ? false
      : port === 465
        ? true
        : true;
  const user = process.env.SMTP_USER;
  const passRaw = process.env.SMTP_PASS;

  if (!user || !passRaw) {
    throw new Error("SMTP credentials are not configured.");
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass: normalizePassword(passRaw),
    },
    from:
      process.env.SMTP_FROM ||
      `Natalie Segal Admin <${user}>`,
  };
}

export async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error("[SMTP] Verification failed:", err);
    throw err;
  }

  cachedTransporter = transporter;
  return cachedTransporter;
}

export function getDefaultFrom() {
  return getSmtpConfig().from;
}
