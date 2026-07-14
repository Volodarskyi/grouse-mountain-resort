import { notFound } from "next/navigation";
import { Alert } from "antd";

import {
    getMenuItemForEdit,
    getMenuItemsForLocation,
} from "@/features/menu/lib/menuItems";
import { resolveTenantContext } from "@/features/tenancy/lib/tenancy";
import { MenuCreatePage } from "@/views/MenuCreatePage/MenuCreatePage";

type MenuEditModulePageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
        menuItemId: string;
    }>;
};

export default async function MenuEditModulePage({
    params,
}: MenuEditModulePageProps) {
    const { organizationSlug, locationSlug, menuItemId } = await params;
    const tenant = resolveTenantContext(organizationSlug, locationSlug);

    if (!tenant) {
        notFound();
    }

    const [menuData, menuItem] = await Promise.all([
        getMenuItemsForLocation(organizationSlug, locationSlug),
        getMenuItemForEdit(menuItemId),
    ]);
    const menuHref = `/org/${organizationSlug}/location/${locationSlug}/menu`;

    if (!menuData) {
        return (
            <main style={{ padding: 32 }}>
                <Alert
                    type="warning"
                    title="Organization or location is not seeded in MongoDB"
                    description="Use the dev seed button first, then return to edit a menu item."
                    showIcon
                />
            </main>
        );
    }

    if (!menuItem) {
        notFound();
    }

    return (
        <MenuCreatePage
            currentLocationId={menuData.location.id}
            currentLocationSlug={locationSlug}
            currentOrganizationId={menuData.organization.id}
            currentOrganizationSlug={organizationSlug}
            initialMenuItem={menuItem}
            locationName={menuData.location.name}
            menuHref={menuHref}
            mode="edit"
            organizationName={menuData.organization.name}
        />
    );
}
