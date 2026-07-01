import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header/Header";
import {
    getLocationsByOrganization,
    getOrganizationBySlug,
} from "@/features/tenancy/lib/tenancy";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { OrganizationLocationsPage } from "@/views/OrganizationLocationsPage/OrganizationLocationsPage";

type OrganizationPageProps = {
    params: Promise<{
        organizationSlug: string;
    }>;
};

export default async function OrganizationPage({
    params,
}: OrganizationPageProps) {
    const { organizationSlug } = await params;
    const organization = getOrganizationBySlug(organizationSlug);

    if (!organization) {
        notFound();
    }

    const locations = getLocationsByOrganization(organization.id);
    const dictionary = getDictionary(defaultLocale);

    return (
        <>
            <Header
                lang={defaultLocale}
                dictionary={dictionary}
                homeHref={`/org/${organization.slug}`}
            />
            <OrganizationLocationsPage
                organization={organization}
                locations={locations}
            />
        </>
    );
}
