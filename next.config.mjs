const sourceEnvs = [
  process.env.NEXT_PUBLIC_MEDIA_BASE,
  process.env.NEXT_PUBLIC_API_BASE,
  process.env.NEXT_PUBLIC_IMAGE_BASE,
];

const remotePatterns = [];
const seenHosts = new Set();

for (const value of sourceEnvs) {
  if (!value) continue;

  try {
    const url = new URL(value);
    const protocol = url.protocol.replace(":", "");
    const hostname = url.hostname;
    const key = `${protocol}://${hostname}:${url.port ?? ""}`;

    if (seenHosts.has(key)) continue;
    seenHosts.add(key);

    const pattern = {
      protocol,
      hostname,
      pathname: "/**",
    };

    if (url.port) {
      pattern.port = url.port;
    }

    remotePatterns.push(pattern);
  } catch {
    // Ignore invalid URLs in env configuration
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",
  images: {
    remotePatterns,
  },
};

export default nextConfig;
