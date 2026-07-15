import { notFound } from "next/navigation";

import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { OrderPreparePage } from "@/views/OrderPreparePage/OrderPreparePage";

type PrepareOrderPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function PrepareOrderPage({
    params,
}: PrepareOrderPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const ordersHref = `/org/${organizationSlug}/location/${locationSlug}/orders`;
    const locationHref = `/org/${organizationSlug}/location/${locationSlug}`;
    const makeOrderHref = `${ordersHref}/make`;

    return (
        <OrderPreparePage
            organizationName={tenant.organization.name}
            organizationHref={`/org/${organizationSlug}`}
            locationName={tenant.location.name}
            locationHref={locationHref}
            navigationLinks={[
                {
                    label: "Orders",
                    href: ordersHref,
                },
                {
                    label: "Make Order",
                    href: makeOrderHref,
                },
                {
                    label: "Menu",
                    href: `${locationHref}/menu`,
                },
                {
                    label: "Training",
                    href: `${locationHref}/training`,
                },
                {
                    label: "Location Home",
                    href: locationHref,
                },
            ]}
        />
    );
}
