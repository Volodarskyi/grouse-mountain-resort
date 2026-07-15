import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Horecan AI",
        short_name: "Horecan",
        description: "Restaurant operations app for Grouse Mountain Resort",
        start_url: "/org/grouse-mountain",
        scope: "/",
        display: "standalone",
        orientation: "landscape",
        background_color: "#ffffff",
        theme_color: "#820024",
        icons: [
            {
                src: "/assets/icons/pwa/horecan-pwa-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/assets/icons/pwa/horecan-pwa-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
