import { describe, expect, it } from "vitest";

import {
    createMenuItemInputSchema,
    deleteMenuItem,
    getMenuItemForEdit,
} from "./menuItems";
import { getProductionAreaForStation } from "../../workstations/model/workstationConstants";

describe("createMenuItemInputSchema", () => {
    const validInput = {
        organizationId: "64f1f77bcf1f7f0012345678",
        locationIds: ["64f1f77bcf1f7f0012345679"],
        groupId: "64f1f77bcf1f7f0012345680",
        name: "Cheeseburger",
        code: "CHEESEBURGER",
        station: "grill",
        price: 14.5,
    };

    it("accepts a valid menu item", () => {
        const result = createMenuItemInputSchema.parse(validInput);

        expect(result.isActive).toBe(true);
        expect(result.isModifiable).toBe(false);
        expect(result.includedIngredientCodes).toEqual([]);
        expect(result.addOnIngredientCodes).toEqual([]);
        expect(result.station).toBe("grill");
    });

    it("accepts modification ingredient codes", () => {
        const result = createMenuItemInputSchema.parse({
            ...validInput,
            isModifiable: true,
            includedIngredientCodes: ["ING_BEEF_PATTY"],
            addOnIngredientCodes: ["ING_CRISPY_BACON"],
        });

        expect(result.isModifiable).toBe(true);
        expect(result.includedIngredientCodes).toEqual(["ING_BEEF_PATTY"]);
        expect(result.addOnIngredientCodes).toEqual(["ING_CRISPY_BACON"]);
    });

    it("can infer production area from the legacy station value", () => {
        expect(getProductionAreaForStation(validInput.station)).toBe("kitchen");
        expect(getProductionAreaForStation("pizza")).toBe("kitchen");
        expect(getProductionAreaForStation("front_desk")).toBe("front_desk");
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

describe("getMenuItemForEdit", () => {
    it("returns null for invalid ids without querying MongoDB", async () => {
        await expect(getMenuItemForEdit("invalid-id")).resolves.toBeNull();
    });
});

describe("deleteMenuItem", () => {
    it("returns null for invalid ids without querying MongoDB", async () => {
        await expect(deleteMenuItem("invalid-id")).resolves.toBeNull();
    });
});
