import { describe, expect, it } from "vitest";

import {
    buildOrderItemSnapshot,
    canTransitionOrderItemStatus,
    canTransitionOrderStatus,
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
});
