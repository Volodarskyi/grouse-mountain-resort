import type { Types } from "mongoose";

import type { ProductionArea } from "../../workstations/model/workstationConstants";
import { getProductionAreaForStation } from "../../workstations/model/workstationConstants";
import type { OrderItemStatus, OrderStatus } from "../model/Order";

type IdLike = string | Types.ObjectId | { toString(): string };

export type OrderMenuItemSource = {
    id?: IdLike;
    _id?: IdLike;
    name: string;
    price: number;
    station: string;
    productionArea?: ProductionArea;
    defaultWorkstationId?: IdLike | null;
};

export type WorkstationSnapshotSource = {
    id: IdLike;
    name: string;
};

export type OrderItemSnapshot = {
    menuItemId: string;
    nameSnapshot: string;
    priceSnapshot: number;
    station: string;
    productionArea: ProductionArea;
    workstationId?: string;
    workstationNameSnapshot: string;
    quantity: number;
    status: OrderItemStatus;
};

const orderStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
    submitted: ["accepted", "in_progress", "cancelled"],
    accepted: ["in_progress", "cancelled"],
    in_progress: ["assembling", "ready", "ready_for_pickup", "cancelled"],
    assembling: ["ready_for_pickup", "cancelled"],
    ready: ["ready_for_pickup", "completed", "cancelled"],
    ready_for_pickup: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

const orderItemStatusTransitions: Record<OrderItemStatus, OrderItemStatus[]> = {
    queued: ["claimed", "preparing", "cancelled"],
    claimed: ["preparing", "ready", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["handed_off", "packed", "cancelled"],
    handed_off: ["packed", "cancelled"],
    packed: [],
    cancelled: [],
};

function stringifyId(value: IdLike | null | undefined) {
    return value ? value.toString() : "";
}

export function canTransitionOrderStatus(
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
) {
    return orderStatusTransitions[fromStatus].includes(toStatus);
}

export function canTransitionOrderItemStatus(
    fromStatus: OrderItemStatus,
    toStatus: OrderItemStatus,
) {
    return orderItemStatusTransitions[fromStatus].includes(toStatus);
}

export function buildOrderItemSnapshot(
    menuItem: OrderMenuItemSource,
    quantity: number,
    workstation?: WorkstationSnapshotSource,
): OrderItemSnapshot {
    const menuItemId = stringifyId(menuItem.id ?? menuItem._id);
    const workstationId = stringifyId(
        workstation?.id ?? menuItem.defaultWorkstationId,
    );

    return {
        menuItemId,
        nameSnapshot: menuItem.name,
        priceSnapshot: menuItem.price,
        station: menuItem.station,
        productionArea:
            menuItem.productionArea ?? getProductionAreaForStation(menuItem.station),
        workstationId: workstationId || undefined,
        workstationNameSnapshot: workstation?.name ?? "",
        quantity,
        status: "queued",
    };
}
