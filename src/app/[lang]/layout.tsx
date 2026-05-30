import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header/Header";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/config";

type LangLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
};

export default async function LangLayout({
                                             children,
                                             params,
                                         }: LangLayoutProps) {
    const { lang } = await params;

    if (!isValidLocale(lang)) {
        notFound();
    }

    const dictionary = await getDictionary(lang);

    return (
        <>
            <Header lang={lang} dictionary={dictionary} />
            {children}
        </>
    );
}