import { MenuCreateForm } from "./MenuCreateForm";

import "./MenuCreatePage.Styles.scss";

type MenuCreatePageProps = {
    currentLocationId?: string;
    currentOrganizationId?: string;
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
        isModifiable: boolean;
        includedIngredientCodes: string[];
        addOnIngredientCodes: string[];
        isActive: boolean;
    };
    locationName: string;
    menuHref: string;
    mode?: "create" | "edit";
    organizationName: string;
    photoOptions: Array<{
        fileName: string;
        imageUrl: string;
    }>;
};

export function MenuCreatePage({
    currentLocationId,
    currentOrganizationId,
    initialMenuItem,
    locationName,
    menuHref,
    mode = "create",
    organizationName,
    photoOptions,
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
                currentOrganizationId={currentOrganizationId}
                initialMenuItem={initialMenuItem}
                menuHref={menuHref}
                mode={mode}
                photoOptions={photoOptions}
            />
        </main>
    );
}
