import type { Metadata } from "next";
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
    title: "Grouse Mountain",
    description: "Restorator AI",
    icons: {
        icon: "/GROUSE-FAVICON_800-round.png",
    },
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