/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscse.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscuk.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
