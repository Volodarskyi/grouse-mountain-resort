import type { Metadata, Viewport } from "next";
// import { Montserrat } from "next/font/google";
import { Lato } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Providers } from "./providers";

import "antd/dist/reset.css";
import "./globals.css";

// const montserrat = Montserrat({
//     variable: "--font-montserrat",
//     subsets: ["latin"],
// });

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
    title: {
        default: "Horecan AI",
        template: "%s | Horecan AI",
    },
    description: "Restaurant operations app for Grouse Mountain Resort",
    applicationName: "Horecan AI",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable: true,
        title: "Horecan AI",
        statusBarStyle: "black-translucent",
    },
    icons: {
        icon: "/assets/icons/pwa/horecan-pwa-192.png",
        apple: "/assets/icons/pwa/horecan-pwa-180.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#820024",
    viewportFit: "cover",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={lato.variable} suppressHydrationWarning>
        <body suppressHydrationWarning>
        <AntdRegistry>
            <Providers>{children}</Providers>
        </AntdRegistry>
        </body>
        </html>
    );
}
