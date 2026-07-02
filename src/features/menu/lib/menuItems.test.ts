import { describe, expect, it } from "vitest";

import { createMenuItemInputSchema } from "./menuItems";

describe("createMenuItemInputSchema", () => {
    const validInput = {
        organizationId: "64f1f77bcf1f7f0012345678",
        locationIds: ["64f1f77bcf1f7f0012345679"],
        name: "Cheeseburger",
        code: "CHEESEBURGER",
        station: "grill",
        price: 14.5,
    };

    it("accepts a valid menu item", () => {
        const result = createMenuItemInputSchema.parse(validInput);

        expect(result.isActive).toBe(true);
        expect(result.station).toBe("grill");
    });

    it("rejects invalid station values", () => {
        const result = createMenuItemInputSchema.safeParse({
            ...validInput,
            station: "dishpit",
        });

        expect(result.success).toBe(false);
    });

    it("requires at least one location", () => {
        const result = createMenuItemInputSchema.safeParse({
            ...validInput,
            locationIds: [],
        });

        expect(result.success).toBe(false);
    });
});
