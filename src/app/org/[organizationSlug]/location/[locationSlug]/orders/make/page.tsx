import { notFound } from "next/navigation";

import { getMenuItemsForLocation } from "@/features/menu/lib/menuItems";
import { OrderMakePage } from "@/views/OrderMakePage/OrderMakePage";

type MakeOrderPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function MakeOrderPage({ params }: MakeOrderPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const menuData = await getMenuItemsForLocation(
        organizationSlug,
        locationSlug,
    );

    if (!menuData) {
        notFound();
    }

    const locationBaseHref = `/org/${organizationSlug}/location/${locationSlug}`;

    return (
        <OrderMakePage
            organizationName={menuData.organization.name}
            organizationHref={`/org/${organizationSlug}`}
            locationName={menuData.location.name}
            locationHref={locationBaseHref}
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
