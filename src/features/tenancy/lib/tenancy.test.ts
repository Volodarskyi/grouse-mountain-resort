import { describe, expect, it } from "vitest";

import {
    getLocationsByOrganization,
    getOrganizationBySlug,
    resolveTenantContext,
} from "./tenancy";

describe("tenancy", () => {
    it("resolves organization locations by URL slugs", () => {
        expect(resolveTenantContext("grouse-mountain", "rusty-rail")?.location.slug).toBe(
            "rusty-rail",
        );
        expect(resolveTenantContext("grouse-mountain", "altitudes-bistro")?.location.slug).toBe(
            "altitudes-bistro",
        );
        expect(resolveTenantContext("grouse-mountain", "the-observatory")?.location.name).toBe(
            "The Observatory",
        );
        expect(resolveTenantContext("grouse-mountain", "lupins")?.location.name).toBe(
            "Lupin's Cafe",
        );
        expect(resolveTenantContext("missing", "rusty-rail")).toBeUndefined();
        expect(resolveTenantContext("grouse-mountain", "missing")).toBeUndefined();
    });

    it("defines Grouse Mountain Resort with four restaurant locations", () => {
        const organization = getOrganizationBySlug("grouse-mountain");

        expect(organization?.name).toBe("Grouse Mountain Resort");
        expect(organization?.defaultLocationSlug).toBe("rusty-rail");
        expect(getLocationsByOrganization("org_grouse").map((location) => location.slug)).toEqual([
            "rusty-rail",
            "altitudes-bistro",
            "the-observatory",
            "lupins",
        ]);
        expect(
            getLocationsByOrganization("org_grouse").every((location) =>
                location.imageUrl.startsWith(
                    "/assets/organizations/grouse-mountain-resort/locations/",
                ),
            ),
        ).toBe(true);
    });
});
