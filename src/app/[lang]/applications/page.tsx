import { ApplicationsListPage } from "@/features/applications-list/components/ApplicationsListPage";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

type ApplicationsPageProps = {
    params: Promise<{
        lang: Locale;
    }>;
};

export default async function ApplicationsPage({
                                                   params,
                                               }: ApplicationsPageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return <ApplicationsListPage lang={lang} dictionary={dictionary} />;
}