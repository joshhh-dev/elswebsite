/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [],
        formats: ['image/webp', 'image/avif'],
         minimumCacheTTL: 60,
         deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Include higher res
    }
};

export default nextConfig;
