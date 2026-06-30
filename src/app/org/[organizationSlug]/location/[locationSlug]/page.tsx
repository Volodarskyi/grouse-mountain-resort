import { notFound } from "next/navigation";

import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { HomePage } from "@/views/HomePage/HomePage";
import { defaultLocale } from "@/i18n/config";

type LocationPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function LocationPage({ params }: LocationPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    return <HomePage lang={defaultLocale} basePath={`/org/${organizationSlug}/location/${locationSlug}`} />;
}
