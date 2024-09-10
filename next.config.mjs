/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript:{
        ignoreBuildErrors: true
    },
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lovely-flamingo-139.convex.cloud'
            },
            {
                protocol: 'https',
                hostname: 'little-flamingo-881.convex.cloud'
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                pathname: '/**', // Include all paths

            }
        ]
    }
};

export default nextConfig;
