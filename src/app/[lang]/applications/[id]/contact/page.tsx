import { ApplicationContactPage } from "@/features/application-form/components/ApplicationContactPage";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

type ContactPageProps = {
    params: Promise<{
        lang: Locale;
        id: string;
    }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
    const { lang, id } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <ApplicationContactPage
            lang={lang}
            applicationId={id}
            dictionary={dictionary}
        />
    );
}