"use server";

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "https://natalie-segal.com";
  }

  return "http://localhost:3000";
}
