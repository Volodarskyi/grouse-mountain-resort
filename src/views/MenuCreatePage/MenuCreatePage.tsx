import { MenuCreateForm } from "./MenuCreateForm";

import "./MenuCreatePage.Styles.scss";

type MenuCreatePageProps = {
    currentLocationId?: string;
    currentOrganizationId?: string;
    locationName: string;
    menuHref: string;
    organizationName: string;
    organizations: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    locations: Array<{
        id: string;
        organizationId: string;
        name: string;
        slug: string;
    }>;
};

export function MenuCreatePage({
    currentLocationId,
    currentOrganizationId,
    locationName,
    locations,
    menuHref,
    organizationName,
    organizations,
}: MenuCreatePageProps) {
    return (
        <main className="menu-create-page">
            <div className="menu-create-page__header">
                <h1 className="menu-create-page__title">Create menu item</h1>
                <p className="menu-create-page__subtitle">
                    {organizationName} / {locationName}
                </p>
            </div>

            <MenuCreateForm
                currentLocationId={currentLocationId}
                currentOrganizationId={currentOrganizationId}
                locations={locations}
                menuHref={menuHref}
                organizations={organizations}
            />
        </main>
    );
}
