import { notFound } from "next/navigation";

import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { KitchenStationPage } from "@/views/KitchenStationPage/KitchenStationPage";

type BarStationPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function BarStationPage({ params }: BarStationPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const locationHref = `/org/${organizationSlug}/location/${locationSlug}`;
    const ordersHref = `${locationHref}/orders`;

    return (
        <KitchenStationPage
            organizationName={tenant.organization.name}
            organizationHref={`/org/${organizationSlug}`}
            organizationSlug={organizationSlug}
            locationName={tenant.location.name}
            locationHref={locationHref}
            locationSlug={locationSlug}
            productionArea="bar"
            stationLabel="Bar"
            navigationLinks={[
                {
                    label: "Prepare Order",
                    href: `${ordersHref}/prepare`,
                },
                {
                    label: "Make Order",
                    href: `${ordersHref}/make`,
                },
                {
                    label: "Orders",
                    href: ordersHref,
                },
                {
                    label: "Menu",
                    href: `${locationHref}/menu`,
                },
                {
                    label: "Location Home",
                    href: locationHref,
                },
            ]}
        />
    );
}
