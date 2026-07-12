import { MenuCreateForm } from "./MenuCreateForm";

import "./MenuCreatePage.Styles.scss";

type MenuCreatePageProps = {
    currentLocationId?: string;
    currentLocationSlug?: string;
    currentOrganizationId?: string;
    currentOrganizationSlug?: string;
    initialMenuItem?: {
        id: string;
        organizationId: string;
        locationIds: string[];
        groupId: string;
        name: string;
        code: string;
        imageUrl: string;
        station: string;
        price: number;
        isActive: boolean;
    };
    locationName: string;
    menuHref: string;
    mode?: "create" | "edit";
    organizationName: string;
};

export function MenuCreatePage({
    currentLocationId,
    currentLocationSlug,
    currentOrganizationId,
    currentOrganizationSlug,
    initialMenuItem,
    locationName,
    menuHref,
    mode = "create",
    organizationName,
}: MenuCreatePageProps) {
    return (
        <main className="menu-create-page">
            <div className="menu-create-page__header">
                <h1 className="menu-create-page__title">
                    {mode === "edit" ? "Edit menu item" : "Create menu item"}
                </h1>
                <p className="menu-create-page__subtitle">
                    {organizationName} / {locationName}
                </p>
            </div>

            <MenuCreateForm
                currentLocationId={currentLocationId}
                currentLocationSlug={currentLocationSlug}
                currentOrganizationId={currentOrganizationId}
                currentOrganizationSlug={currentOrganizationSlug}
                initialMenuItem={initialMenuItem}
                menuHref={menuHref}
                mode={mode}
            />
        </main>
    );
}
