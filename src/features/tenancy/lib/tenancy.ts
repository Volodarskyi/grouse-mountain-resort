import type { Location, Organization, TenantContext } from "../model/tenancy";
import { locations, organizations } from "../model/tenancyData";

export function getOrganizationBySlug(
    organizationSlug: string,
): Organization | undefined {
    return organizations.find((organization) => organization.slug === organizationSlug);
}

export function getLocationsByOrganization(
    organizationId: string,
): Location[] {
    return locations.filter((location) => location.organizationId === organizationId);
}

export function getLocationBySlug(
    organizationId: string,
    locationSlug: string,
): Location | undefined {
    return locations.find(
        (location) =>
            location.organizationId === organizationId && location.slug === locationSlug,
    );
}

export function resolveTenantContext(
    organizationSlug: string,
    locationSlug: string,
): TenantContext | undefined {
    const organization = getOrganizationBySlug(organizationSlug);

    if (!organization) {
        return undefined;
    }

    const location = getLocationBySlug(organization.id, locationSlug);

    if (!location) {
        return undefined;
    }

    return {
        organization,
        location,
    };
}
