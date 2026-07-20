import type { Types } from "mongoose";

import type { ProductionArea } from "../../workstations/model/workstationConstants";
import { getProductionAreaForStation } from "../../workstations/model/workstationConstants";
import type { OrderItemStatus, OrderStatus } from "../model/Order";

type IdLike = string | Types.ObjectId | { toString(): string };

export type OrderMenuItemSource = {
    id?: IdLike;
    _id?: IdLike;
    imageUrl?: string;
    name: string;
    price: number;
    station: string;
    productionArea?: ProductionArea;
    defaultWorkstationId?: IdLike | null;
};

export type OrderItemModificationSnapshot = {
    code: string;
    name: string;
    quantity?: number;
    type: "added" | "removed";
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
    imageUrlSnapshot: string;
    modifications: OrderItemModificationSnapshot[];
    quantity: number;
    status: OrderItemStatus;
};

type OrderWorkflowItemInput =
    | OrderItemStatus
    | {
          productionArea?: ProductionArea;
          status: OrderItemStatus;
      };

const orderStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
    submitted: ["accepted", "in_progress", "ready", "cancelled"],
    accepted: ["in_progress", "ready", "cancelled"],
    in_progress: ["assembling", "ready", "ready_for_pickup", "cancelled"],
    assembling: ["ready_for_pickup", "cancelled"],
    ready: ["ready_for_pickup", "completed", "cancelled"],
    ready_for_pickup: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

const orderItemStatusTransitions: Record<OrderItemStatus, OrderItemStatus[]> = {
    queued: ["claimed", "preparing", "ready", "cancelled"],
    claimed: ["preparing", "ready", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["queued", "claimed", "preparing", "handed_off", "packed", "cancelled"],
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

export function isOrderItemDone(status: OrderItemStatus) {
    return status === "ready" || status === "handed_off" || status === "packed";
}

function getWorkflowItemStatus(item: OrderWorkflowItemInput) {
    return typeof item === "string" ? item : item.status;
}

function isProductionWorkflowItem(item: OrderWorkflowItemInput) {
    return typeof item === "string" || item.productionArea !== "expo";
}

export function getNextOrderStatusForItems(
    currentStatus: OrderStatus,
    items: OrderWorkflowItemInput[],
): OrderStatus | null {
    if (currentStatus === "completed" || currentStatus === "cancelled") {
        return null;
    }

    const activeItemStatuses = items
        .filter(isProductionWorkflowItem)
        .map(getWorkflowItemStatus)
        .filter((status) => status !== "cancelled");

    if (activeItemStatuses.length === 0) {
        return null;
    }

    if (activeItemStatuses.every(isOrderItemDone)) {
        return currentStatus === "ready" ? null : "ready";
    }

    if (currentStatus === "ready" || currentStatus === "ready_for_pickup") {
        return "in_progress";
    }

    if (
        currentStatus === "submitted" &&
        activeItemStatuses.some((status) => status !== "queued")
    ) {
        return "in_progress";
    }

    return null;
}

export function buildOrderItemSnapshot(
    menuItem: OrderMenuItemSource,
    quantity: number,
    modifications: OrderItemModificationSnapshot[] = [],
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
        imageUrlSnapshot: menuItem.imageUrl ?? "",
        modifications,
        quantity,
        status: "queued",
    };
}
