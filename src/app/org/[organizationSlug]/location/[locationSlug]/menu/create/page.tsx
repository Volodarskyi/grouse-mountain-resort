import { notFound } from "next/navigation";
import { Alert } from "antd";

import {
    getMenuItemFormOptions,
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

    const [menuData, formOptions] = await Promise.all([
        getMenuItemsForLocation(organizationSlug, locationSlug),
        getMenuItemFormOptions(),
    ]);
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
            currentOrganizationId={menuData.organization.id}
            locationName={menuData.location.name}
            locations={formOptions.locations}
            menuHref={menuHref}
            organizationName={menuData.organization.name}
            organizations={formOptions.organizations}
        />
    );
}
