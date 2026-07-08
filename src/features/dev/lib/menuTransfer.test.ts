import { describe, expect, it } from "vitest";

import { importMenuTransferInputSchema } from "./menuTransfer";

const validInput = {
    organizationId: "64f1f77bcf1f7f0012345678",
    locationId: "64f1f77bcf1f7f0012345679",
    data: {
        schemaVersion: 2,
        groups: [
            {
                name: "Hot Dogs",
                icon: "/assets/icons/menu/icon-hot-dog.svg",
            },
        ],
        menuItems: [
            {
                groupName: "Hot Dogs",
                name: "Classic Hot Dog",
                code: "CLASSIC_HOT_DOG",
                station: "front_desk",
                productionArea: "front_desk",
                price: 8.5,
                recipeCode: "CLASSIC_HOT_DOG_RECIPE",
                isActive: true,
            },
        ],
    },
};

describe("importMenuTransferInputSchema", () => {
    it("accepts a valid menu transfer payload", () => {
        const result = importMenuTransferInputSchema.parse(validInput);

        expect(result.data.groups).toHaveLength(1);
        expect(result.data.menuItems[0]?.code).toBe("CLASSIC_HOT_DOG");
    });

    it("rejects unsupported schema versions", () => {
        const result = importMenuTransferInputSchema.safeParse({
            ...validInput,
            data: {
                ...validInput.data,
                schemaVersion: 1,
            },
        });

        expect(result.success).toBe(false);
    });

    it("rejects invalid menu item stations", () => {
        const result = importMenuTransferInputSchema.safeParse({
            ...validInput,
            data: {
                ...validInput.data,
                menuItems: [
                    {
                        ...validInput.data.menuItems[0],
                        station: "dishpit",
                    },
                ],
            },
        });

        expect(result.success).toBe(false);
    });

    it("accepts menu items without an existing recipe yet", () => {
        const result = importMenuTransferInputSchema.parse({
            ...validInput,
            data: {
                ...validInput.data,
                menuItems: [
                    {
                        ...validInput.data.menuItems[0],
                        recipeCode: null,
                    },
                ],
            },
        });

        expect(result.data.menuItems[0]?.recipeCode).toBeNull();
    });
});
