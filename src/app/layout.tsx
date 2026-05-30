import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import {Providers} from "./providers";
import "./globals.css";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Grouse Mountain",
    description: "Restorator AI",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={montserrat.variable}
            suppressHydrationWarning
        >
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}