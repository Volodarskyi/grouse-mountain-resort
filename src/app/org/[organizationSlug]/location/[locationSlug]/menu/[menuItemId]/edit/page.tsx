import { notFound } from "next/navigation";
import { Alert } from "antd";

import {
    getMenuItemForEdit,
    getMenuItemsForLocation,
} from "@/features/menu/lib/menuItems";
import { getMenuItemPhotoOptions } from "@/features/menu/lib/menuItemPhotos";
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

    const [menuData, menuItem, photoOptions] = await Promise.all([
        getMenuItemsForLocation(organizationSlug, locationSlug),
        getMenuItemForEdit(menuItemId),
        getMenuItemPhotoOptions(locationSlug),
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
            currentOrganizationId={menuData.organization.id}
            initialMenuItem={menuItem}
            locationName={menuData.location.name}
            menuHref={menuHref}
            mode="edit"
            organizationName={menuData.organization.name}
            photoOptions={photoOptions}
        />
    );
}
