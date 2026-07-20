import { notFound } from "next/navigation";
import { Alert } from "antd";

import { getMenuItemsForLocation } from "@/features/menu/lib/menuItems";
import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { OrderMakePage } from "@/views/OrderMakePage/OrderMakePage";

type MakeOrderPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function MakeOrderPage({ params }: MakeOrderPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const menuData = await getMenuItemsForLocation(
        organizationSlug,
        locationSlug,
    );

    if (!menuData) {
        return (
            <main style={{ padding: 32 }}>
                <Alert
                    type="warning"
                    title="Organization or location is not seeded in MongoDB"
                    description="Use the dev seed button first, then return to make an order."
                    showIcon
                />
            </main>
        );
    }

    const locationBaseHref = `/org/${organizationSlug}/location/${locationSlug}`;

    return (
        <OrderMakePage
            organizationName={menuData.organization.name}
            organizationHref={`/org/${organizationSlug}`}
            organizationSlug={organizationSlug}
            locationName={menuData.location.name}
            locationHref={locationBaseHref}
            locationSlug={locationSlug}
            menuGroups={menuData.menuGroups}
            menuItems={menuData.menuItems}
            navigationLinks={[
                {
                    label: "Orders",
                    href: `${locationBaseHref}/orders`,
                },
                {
                    label: "Prepare Order",
                    href: `${locationBaseHref}/orders/prepare`,
                },
                {
                    label: "Menu",
                    href: `${locationBaseHref}/menu`,
                },
                {
                    label: "Training",
                    href: `${locationBaseHref}/training`,
                },
                {
                    label: "Location Home",
                    href: locationBaseHref,
                },
            ]}
        />
    );
}
