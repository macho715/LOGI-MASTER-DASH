/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/shared"],
  images: {
    unoptimized: true,
  },
 
}

export default nextConfig
