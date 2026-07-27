import type { NextConfig } from "next";

function apiImageRemotePattern() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:3002";

  try {
    const url = new URL(raw);
    return {
      protocol: (url.protocol.replace(":", "") || "http") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**" as const,
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "3002",
      pathname: "/uploads/**" as const,
    };
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [apiImageRemotePattern()],
    // Next.js 16 blocks optimizing images that resolve to private IPs
    // (localhost / 127.0.0.1). Required so hero slides from the local Nest
    // API can be optimized in development. remotePatterns still scopes hosts.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
