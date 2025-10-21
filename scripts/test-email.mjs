#!/usr/bin/env node

import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");

dotenv.config({
  path: path.join(projectRoot, ".env.local"),
  override: true,
});

const emailModule = await import(
  pathToFileURL(path.join(projectRoot, "lib/email/index.js"))
);
const { sendForgotPasswordEmail, sendEmailChangeVerification } = emailModule;

function parseArgs() {
  const args = process.argv.slice(2);
  const map = {};
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const [flag, inlineValue] = token.split("=", 2);
    const key = flag.replace(/^--/, "");
    if (inlineValue !== undefined) {
      map[key] = inlineValue;
      continue;
    }
    const next = args[i + 1];
    if (next && !next.startsWith("--")) {
      map[key] = next;
      i += 1;
    } else {
      map[key] = "true";
    }
  }
  return map;
}

function requireArg(args, name) {
  if (!args[name]) {
    throw new Error(`Missing required argument --${name}`);
  }
  return args[name];
}

async function main() {
  const args = parseArgs();
  const to = requireArg(args, "to");
  const type = (args.type || "forgot-password").toLowerCase();

  console.log(`📬 Sending test "${type}" email to ${to}...`);

  if (type === "forgot-password") {
    const resetUrl =
      args.resetUrl ||
      "https://example.com/admin/login/reset?token=demo-token";

    await sendForgotPasswordEmail({
      to,
      name: args.name || "Natalie",
      resetUrl,
    });

    console.log("✅ Forgot-password email queued successfully.");
    console.log(`   Reset URL: ${resetUrl}`);
    return;
  }

  if (type === "email-change") {
    const code = args.code || crypto.randomInt(100000, 1000000).toString();
    const newEmail = requireArg(args, "newEmail");
    const minutes = Number(args.expires || 10);

    await sendEmailChangeVerification({
      to,
      name: args.name || "Natalie",
      code,
      newEmail,
      expiresMinutes: minutes,
    });

    console.log("✅ Email-change verification email queued successfully.");
    console.log(`   Code: ${code} (expires in ${minutes} minutes)`);
    return;
  }

  throw new Error(
    `Unsupported type "${type}". Choose "forgot-password" or "email-change".`
  );
}

main()
  .then(() => {
    console.log("Done.");
  })
  .catch((err) => {
    console.error("❌ Failed to send test email:", err);
    process.exitCode = 1;
  });
