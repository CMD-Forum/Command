import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Command',
        short_name: 'Command',
        description: 'Command is a forum site for people to share news, interests or anything they can think of.',
        start_url: '/',
        display: 'standalone',
        background_color: '#09090b',
        theme_color: '#18181b',
        categories: ["social networking", "entertainment", "news", "photo & video"],
        icons: [
            {
                src: '/Icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/Icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/Icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/Icon-1024x1024.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
        ],
    }
}