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
        icon: "/GROUSE-FAVICON_800-round.png",
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
        <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}