import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
    "./translation/i18n/request.ts"
);

/*const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})*/
 
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    env: {
        commandVersion: "1.5.0"
    },
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "https://localhost:3000", "http://localhost:3000", "https://cmd-forum.vercel.app"]
        },
        reactCompiler: true,
        authInterrupts: true,
        useCache: true,
        useLightningcss: true,
        browserDebugInfoInTerminal: true,
        cacheComponents: true,
        clientSegmentCache: true,
        devtoolSegmentExplorer: true,
        globalNotFound: true,
        webVitalsAttribution: ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**"
            }
        ],
    },
};
 
export default withNextIntl(nextConfig);