import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header/Header";
import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

type LocationLayoutProps = {
    children: React.ReactNode;
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function LocationLayout({
    children,
    params,
}: LocationLayoutProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const locationBasePath = `/org/${organizationSlug}/location/${locationSlug}`;
    const dictionary = getDictionary(defaultLocale);

    return (
        <>
            <Header
                lang={defaultLocale}
                dictionary={dictionary}
                homeHref={locationBasePath}
            />
            {children}
        </>
    );
}
