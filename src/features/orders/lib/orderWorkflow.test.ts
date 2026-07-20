import { describe, expect, it } from "vitest";

import {
    buildOrderItemSnapshot,
    canTransitionOrderItemStatus,
    canTransitionOrderStatus,
    getNextOrderStatusForItems,
} from "./orderWorkflow";

describe("buildOrderItemSnapshot", () => {
    it("keeps menu item routing snapshots for kitchen work", () => {
        const snapshot = buildOrderItemSnapshot(
            {
                _id: "64f1f77bcf1f7f0012345678",
                name: "Classic Burger",
                price: 16,
                station: "grill",
            },
            2,
            [],
            {
                id: "64f1f77bcf1f7f0012345679",
                name: "Station 1 - Patties",
            },
        );

        expect(snapshot).toEqual({
            menuItemId: "64f1f77bcf1f7f0012345678",
            nameSnapshot: "Classic Burger",
            priceSnapshot: 16,
            station: "grill",
            productionArea: "kitchen",
            workstationId: "64f1f77bcf1f7f0012345679",
            workstationNameSnapshot: "Station 1 - Patties",
            imageUrlSnapshot: "",
            modifications: [],
            quantity: 2,
            status: "queued",
        });
    });

    it("routes front desk items to the front desk production area", () => {
        const snapshot = buildOrderItemSnapshot(
            {
                id: "64f1f77bcf1f7f0012345680",
                name: "French Fries",
                price: 6,
                station: "front_desk",
            },
            1,
        );

        expect(snapshot.productionArea).toBe("front_desk");
        expect(snapshot.workstationId).toBeUndefined();
    });

    it("keeps menu item customization snapshots", () => {
        const snapshot = buildOrderItemSnapshot(
            {
                id: "64f1f77bcf1f7f0012345681",
                imageUrl: "/burger.png",
                name: "Burger",
                price: 12,
                station: "grill",
            },
            1,
            [
                {
                    code: "onion",
                    name: "Onion",
                    type: "removed",
                },
                {
                    code: "cheese",
                    name: "Cheese",
                    quantity: 2,
                    type: "added",
                },
            ],
        );

        expect(snapshot.imageUrlSnapshot).toBe("/burger.png");
        expect(snapshot.modifications).toEqual([
            {
                code: "onion",
                name: "Onion",
                type: "removed",
            },
            {
                code: "cheese",
                name: "Cheese",
                quantity: 2,
                type: "added",
            },
        ]);
    });
});

describe("canTransitionOrderStatus", () => {
    it("allows the front desk assembler flow", () => {
        expect(canTransitionOrderStatus("submitted", "accepted")).toBe(true);
        expect(canTransitionOrderStatus("accepted", "in_progress")).toBe(true);
        expect(canTransitionOrderStatus("in_progress", "assembling")).toBe(true);
        expect(canTransitionOrderStatus("assembling", "ready_for_pickup")).toBe(
            true,
        );
        expect(canTransitionOrderStatus("ready_for_pickup", "completed")).toBe(
            true,
        );
    });

    it("rejects reopening completed orders", () => {
        expect(canTransitionOrderStatus("completed", "in_progress")).toBe(false);
    });

    it("moves a submitted order to in progress when some items are done", () => {
        expect(getNextOrderStatusForItems("submitted", ["ready", "queued"])).toBe(
            "in_progress",
        );
    });

    it("moves an order to ready when every active item is done", () => {
        expect(getNextOrderStatusForItems("submitted", ["ready"])).toBe("ready");
        expect(
            getNextOrderStatusForItems("in_progress", ["ready", "packed"]),
        ).toBe("ready");
    });

    it("moves an order to ready when all production station items are done", () => {
        expect(
            getNextOrderStatusForItems("in_progress", [
                {
                    productionArea: "front_desk",
                    status: "ready",
                },
                {
                    productionArea: "kitchen",
                    status: "ready",
                },
                {
                    productionArea: "bar",
                    status: "ready",
                },
                {
                    productionArea: "expo",
                    status: "queued",
                },
            ]),
        ).toBe("ready");
    });

    it("keeps an order in progress while any production station item is not done", () => {
        expect(
            getNextOrderStatusForItems("in_progress", [
                {
                    productionArea: "kitchen",
                    status: "ready",
                },
                {
                    productionArea: "bar",
                    status: "queued",
                },
                {
                    productionArea: "expo",
                    status: "queued",
                },
            ]),
        ).toBeNull();
    });

    it("moves a ready order back to in progress when an item is undone", () => {
        expect(getNextOrderStatusForItems("ready", ["ready", "queued"])).toBe(
            "in_progress",
        );
    });
});

describe("canTransitionOrderItemStatus", () => {
    it("allows kitchen handoff to front desk assembly", () => {
        expect(canTransitionOrderItemStatus("queued", "claimed")).toBe(true);
        expect(canTransitionOrderItemStatus("claimed", "preparing")).toBe(true);
        expect(canTransitionOrderItemStatus("preparing", "ready")).toBe(true);
        expect(canTransitionOrderItemStatus("ready", "handed_off")).toBe(true);
        expect(canTransitionOrderItemStatus("handed_off", "packed")).toBe(true);
    });

    it("rejects changing packed items", () => {
        expect(canTransitionOrderItemStatus("packed", "ready")).toBe(false);
    });

    it("allows a station to mark a queued item ready from the Done button", () => {
        expect(canTransitionOrderItemStatus("queued", "ready")).toBe(true);
    });

    it("allows undoing a ready item back to its previous workflow status", () => {
        expect(canTransitionOrderItemStatus("ready", "queued")).toBe(true);
        expect(canTransitionOrderItemStatus("ready", "preparing")).toBe(true);
    });
});
