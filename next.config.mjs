/** @type {import('next').NextConfig} */
const nextConfig =
  process.env.NEXT_OUTPUT === "standalone"
    ? { output: "standalone" }
    : {};

export default nextConfig;
