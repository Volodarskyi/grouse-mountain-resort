import type { Location, Organization } from "./tenancy";

const grouseMountainAddress = "6400 Nancy Greene Way, North Vancouver, BC";

export const organizations: Organization[] = [
    {
        id: "org_grouse",
        slug: "grouse-mountain",
        name: "Grouse Mountain Resort",
        defaultLocationSlug: "rusty-rail",
    },
];

export const locations: Location[] = [
    {
        id: "loc_rusty_rail",
        organizationId: "org_grouse",
        slug: "rusty-rail",
        name: "Rusty Rail",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "/assets/organizations/grouse-mountain-resort/locations/rusty-rail.jpg",
    },
    {
        id: "loc_altitudes_bistro",
        organizationId: "org_grouse",
        slug: "altitudes-bistro",
        name: "Altitudes Bistro",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "/assets/organizations/grouse-mountain-resort/locations/altitudes-bistro.jpg",
    },
    {
        id: "loc_observatory",
        organizationId: "org_grouse",
        slug: "the-observatory",
        name: "The Observatory",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "/assets/organizations/grouse-mountain-resort/locations/the-observatory.webp",
    },
    {
        id: "loc_lupins_cafe",
        organizationId: "org_grouse",
        slug: "lupins",
        name: "Lupin's Cafe",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "/assets/organizations/grouse-mountain-resort/locations/lupins.jpg",
    },
];
