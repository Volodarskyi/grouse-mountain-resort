import { notFound } from "next/navigation";
import { Alert } from "antd";

import {
    getMenuItemsForLocation,
} from "@/features/menu/lib/menuItems";
import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { MenuCreatePage } from "@/views/MenuCreatePage/MenuCreatePage";

type MenuCreateModulePageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function MenuCreateModulePage({
    params,
}: MenuCreateModulePageProps) {
    const { organizationSlug, locationSlug } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const menuData = await getMenuItemsForLocation(organizationSlug, locationSlug);
    const menuHref = `/org/${organizationSlug}/location/${locationSlug}/menu`;

    if (!menuData) {
        return (
            <main style={{ padding: 32 }}>
                <Alert
                    type="warning"
                    title="Organization or location is not seeded in MongoDB"
                    description="Use the dev seed button first, then return to create a menu item."
                    showIcon
                />
            </main>
        );
    }

    return (
        <MenuCreatePage
            currentLocationId={menuData.location.id}
            currentLocationSlug={locationSlug}
            currentOrganizationId={menuData.organization.id}
            currentOrganizationSlug={organizationSlug}
            locationName={menuData.location.name}
            menuHref={menuHref}
            organizationName={menuData.organization.name}
        />
    );
}
