/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'unsplash.it',
            port: '',
            // pathname: '/account123/**',
        },
        ],
    },
};

export default nextConfig;
