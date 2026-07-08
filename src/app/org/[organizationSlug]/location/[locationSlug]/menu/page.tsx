import { notFound } from "next/navigation";
import { Alert } from "antd";

import { getMenuItemsForLocation } from "@/features/menu/lib/menuItems";
import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { MenuPage } from "@/views/MenuPage/MenuPage";

type MenuModulePageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function MenuModulePage({ params }: MenuModulePageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const menuData = await getMenuItemsForLocation(organizationSlug, locationSlug);
    const basePath = `/org/${organizationSlug}/location/${locationSlug}/menu`;

    if (!menuData) {
        return (
            <main style={{ padding: 32 }}>
                <Alert
                    type="warning"
                    title="Organization or location is not seeded in MongoDB"
                    description="Use the dev seed button first, then return to this menu."
                    showIcon
                />
            </main>
        );
    }

    return (
        <MenuPage
            addHref={`${basePath}/create`}
            baseHref={basePath}
            locationName={menuData.location.name}
            menuGroups={menuData.menuGroups}
            menuItems={menuData.menuItems}
            organizationName={menuData.organization.name}
        />
    );
}
