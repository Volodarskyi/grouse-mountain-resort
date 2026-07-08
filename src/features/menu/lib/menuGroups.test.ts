import { describe, expect, it } from "vitest";

import { createMenuGroupInputSchema } from "./menuGroups";

describe("createMenuGroupInputSchema", () => {
    const validInput = {
        organizationId: "64f1f77bcf1f7f0012345678",
        locationId: "64f1f77bcf1f7f0012345679",
        name: "Burgers",
        icon: "/assets/icons/menu/icon-burger.svg",
    };

    it("accepts a valid menu group", () => {
        const result = createMenuGroupInputSchema.parse(validInput);

        expect(result.name).toBe("Burgers");
    });

    it("accepts newly added menu icons", () => {
        const result = createMenuGroupInputSchema.parse({
            ...validInput,
            icon: "/assets/icons/menu/icon-hot-dog.svg",
        });

        expect(result.icon).toBe("/assets/icons/menu/icon-hot-dog.svg");
    });

    it("rejects icons outside the allowed list", () => {
        const result = createMenuGroupInputSchema.safeParse({
            ...validInput,
            icon: "/assets/icons/menu/custom.svg",
        });

        expect(result.success).toBe(false);
    });
});
