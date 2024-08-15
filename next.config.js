/** @type {import('next').NextConfig} */

//const withBundleAnalyzer = require('@next/bundle-analyzer')({
//    enabled: true,
//})

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    output: "standalone",
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
        serverActions: {
            allowedOrigins: ['localhost:3000', 'http://localhost:3000']
        }
    },
}

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;