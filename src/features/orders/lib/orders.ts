import mongoose, { type Types } from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "@/lib/mongodb";
import LocationModel from "@/features/locations/model/Location";
import MenuItemModel from "@/features/menu/model/MenuItem";
import OrganizationModel from "@/features/organizations/model/Organization";
import type { ProductionArea } from "@/features/workstations/model/workstationConstants";
import {
    buildOrderItemSnapshot,
    canTransitionOrderItemStatus,
    canTransitionOrderStatus,
    getNextOrderStatusForItems,
    type OrderItemModificationSnapshot,
} from "./orderWorkflow";
import OrderModel, {
    orderItemStatuses,
    orderStatuses,
    type OrderItemStatus,
    type OrderStatus,
} from "../model/Order";
import OrderCounterModel from "../model/OrderCounter";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

const orderItemModificationInputSchema = z.object({
    code: z.string().trim().min(1).max(120),
    name: z.string().trim().min(1).max(160),
    quantity: z.number().int().min(1).optional(),
    type: z.enum(["added", "removed"]),
});

export const createOrderInputSchema = z.object({
    clientRequestId: z.string().trim().min(1).max(160),
    customerName: z.string().trim().max(160).default(""),
    notes: z.string().trim().max(1000).default(""),
    items: z
        .array(
            z.object({
                menuItemId: objectIdSchema,
                modifications: z
                    .array(orderItemModificationInputSchema)
                    .default([]),
                quantity: z.number().int().min(1).max(99),
            }),
        )
        .min(1),
});

export const updateOrderStatusInputSchema = z.object({
    status: z.enum(orderStatuses),
    note: z.string().trim().max(1000).default(""),
});

export const updateOrderItemStatusInputSchema = z.object({
    status: z.enum(orderItemStatuses),
});

export type CreateOrderInput = z.input<typeof createOrderInputSchema>;
export type UpdateOrderStatusInput = z.input<
    typeof updateOrderStatusInputSchema
>;
export type UpdateOrderItemStatusInput = z.input<
    typeof updateOrderItemStatusInputSchema
>;

type TenantIds = {
    locationId: Types.ObjectId;
    organizationId: Types.ObjectId;
};

type OrderErrorCode =
    | "conflict"
    | "invalid_transition"
    | "not_found"
    | "validation";

export class OrderError extends Error {
    code: OrderErrorCode;
    status: number;

    constructor(message: string, code: OrderErrorCode, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

function getBusinessDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "America/Vancouver",
        year: "numeric",
    }).format(date);
}

function serializeOrderId(value: unknown) {
    return value && typeof value === "object" && "toString" in value
        ? value.toString()
        : "";
}

async function resolveTenantIds(
    organizationSlug: string,
    locationSlug: string,
): Promise<TenantIds> {
    await connectToMongoDB();

    const organization = await OrganizationModel.findOne({
        slug: organizationSlug,
    }).lean();

    if (!organization) {
        throw new OrderError("Organization not found", "not_found", 404);
    }

    const location = await LocationModel.findOne({
        organizationId: organization._id,
        slug: locationSlug,
    }).lean();

    if (!location) {
        throw new OrderError("Location not found", "not_found", 404);
    }

    return {
        organizationId: organization._id,
        locationId: location._id,
    };
}

async function getNextOrderNumber({
    businessDate,
    locationId,
    organizationId,
}: TenantIds & { businessDate: string }) {
    const counter = await OrderCounterModel.findOneAndUpdate(
        {
            organizationId,
            locationId,
            businessDate,
        },
        {
            $inc: {
                sequence: 1,
            },
        },
        {
            new: true,
            setDefaultsOnInsert: true,
            upsert: true,
        },
    );

    return String(counter.sequence).padStart(7, "0");
}

function getActiveStatuses() {
    return orderStatuses.filter(
        (status) => status !== "completed" && status !== "cancelled",
    );
}

function getOrderItemStatuses(
    items: Array<{
        productionArea?: ProductionArea;
        status: OrderItemStatus;
    }>,
) {
    return items.map((item) => ({
        productionArea: item.productionArea,
        status: item.status,
    }));
}

async function applyOrderStatusFromItems(
    tenantIds: TenantIds,
    order: {
        _id: unknown;
        items?: Array<{
            productionArea?: ProductionArea;
            status: OrderItemStatus;
        }>;
        status: OrderStatus;
    },
) {
    const nextOrderStatus = getNextOrderStatusForItems(
        order.status,
        getOrderItemStatuses(order.items ?? []),
    );

    if (
        !nextOrderStatus ||
        !canTransitionOrderStatus(order.status, nextOrderStatus)
    ) {
        return order;
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
        {
            ...tenantIds,
            _id: order._id,
            status: order.status,
        },
        {
            $push: {
                statusHistory: {
                    fromStatus: order.status,
                    note: "Order status updated from item workflow",
                    toStatus: nextOrderStatus,
                },
            },
            $set: {
                status: nextOrderStatus,
            },
        },
        {
            new: true,
            runValidators: true,
        },
    ).lean();

    return updatedOrder ?? order;
}

function serializeOrder(order: {
    _id: unknown;
    businessDate: string;
    clientRequestId?: string;
    createdAt?: Date;
    customerName?: string;
    items?: Array<{
        _id: unknown;
        handedOffAt?: Date;
        imageUrlSnapshot?: string;
        menuItemId: unknown;
        modifications?: OrderItemModificationSnapshot[];
        nameSnapshot: string;
        packedAt?: Date;
        preparedByUserId?: unknown;
        previousStatus?: OrderItemStatus;
        priceSnapshot: number;
        productionArea: ProductionArea;
        quantity: number;
        readyAt?: Date;
        station: string;
        status: OrderItemStatus;
        workstationId?: unknown;
        workstationNameSnapshot?: string;
    }>;
    notes?: string;
    orderNumber: string;
    status: OrderStatus;
    total?: number;
    updatedAt?: Date;
}) {
    return {
        id: serializeOrderId(order._id),
        businessDate: order.businessDate,
        clientRequestId: order.clientRequestId ?? "",
        createdAt: order.createdAt?.toISOString() ?? "",
        customerName: order.customerName ?? "",
        items: (order.items ?? []).map((item) => ({
            id: serializeOrderId(item._id),
            handedOffAt: item.handedOffAt?.toISOString() ?? "",
            imageUrl: item.imageUrlSnapshot ?? "",
            menuItemId: serializeOrderId(item.menuItemId),
            modifications: item.modifications ?? [],
            name: item.nameSnapshot,
            packedAt: item.packedAt?.toISOString() ?? "",
            preparedByUserId: serializeOrderId(item.preparedByUserId),
            previousStatus: item.previousStatus ?? "",
            price: item.priceSnapshot,
            productionArea: item.productionArea,
            quantity: item.quantity,
            readyAt: item.readyAt?.toISOString() ?? "",
            station: item.station,
            status: item.status,
            workstationId: serializeOrderId(item.workstationId),
            workstationName: item.workstationNameSnapshot ?? "",
        })),
        notes: order.notes ?? "",
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total ?? 0,
        updatedAt: order.updatedAt?.toISOString() ?? "",
    };
}

export async function createOrderForLocation(
    organizationSlug: string,
    locationSlug: string,
    input: CreateOrderInput,
) {
    const parsedInput = createOrderInputSchema.parse(input);
    const tenantIds = await resolveTenantIds(organizationSlug, locationSlug);
    const existingOrder = await OrderModel.findOne({
        ...tenantIds,
        clientRequestId: parsedInput.clientRequestId,
    }).lean();

    if (existingOrder) {
        return serializeOrder(existingOrder);
    }

    const menuItemIds = parsedInput.items.map((item) => item.menuItemId);
    const menuItems = await MenuItemModel.find({
        _id: {
            $in: menuItemIds,
        },
        organizationId: tenantIds.organizationId,
        locationIds: tenantIds.locationId,
        isActive: true,
    }).lean();
    const menuItemById = new Map(
        menuItems.map((menuItem) => [menuItem._id.toString(), menuItem]),
    );

    if (menuItemById.size !== new Set(menuItemIds).size) {
        throw new OrderError(
            "One or more menu items are not available for this location",
            "validation",
            400,
        );
    }

    const items = parsedInput.items.map((item) => {
        const menuItem = menuItemById.get(item.menuItemId);

        if (!menuItem) {
            throw new OrderError("Menu item not found", "validation", 400);
        }

        return buildOrderItemSnapshot(
            {
                _id: menuItem._id,
                defaultWorkstationId: menuItem.defaultWorkstationId,
                imageUrl: menuItem.imageUrl ?? "",
                name: menuItem.name,
                price: menuItem.price,
                productionArea: menuItem.productionArea,
                station: menuItem.station,
            },
            item.quantity,
            item.modifications,
        );
    });
    const businessDate = getBusinessDate();
    const orderNumber = await getNextOrderNumber({
        ...tenantIds,
        businessDate,
    });
    const total = items.reduce(
        (sum, item) => sum + item.priceSnapshot * item.quantity,
        0,
    );

    try {
        const order = await OrderModel.create({
            ...tenantIds,
            businessDate,
            clientRequestId: parsedInput.clientRequestId,
            customerName: parsedInput.customerName,
            items,
            notes: parsedInput.notes,
            orderNumber,
            source: "staff",
            status: "submitted",
            statusHistory: [
                {
                    toStatus: "submitted",
                    note: "Order submitted",
                },
            ],
            total,
        });

        return serializeOrder(order);
    } catch (error) {
        if (
            error instanceof mongoose.mongo.MongoServerError &&
            error.code === 11000
        ) {
            const duplicateOrder = await OrderModel.findOne({
                ...tenantIds,
                clientRequestId: parsedInput.clientRequestId,
            }).lean();

            if (duplicateOrder) {
                return serializeOrder(duplicateOrder);
            }
        }

        throw error;
    }
}

export async function getActiveOrdersForLocation(
    organizationSlug: string,
    locationSlug: string,
) {
    const tenantIds = await resolveTenantIds(organizationSlug, locationSlug);
    const orders = await OrderModel.find({
        ...tenantIds,
        status: {
            $in: getActiveStatuses(),
        },
    })
        .sort({ createdAt: 1 })
        .lean();
    const ordersWithWorkflowStatus = await Promise.all(
        orders.map((order) => applyOrderStatusFromItems(tenantIds, order)),
    );

    return ordersWithWorkflowStatus.map(serializeOrder);
}

export async function updateOrderStatusForLocation(
    organizationSlug: string,
    locationSlug: string,
    orderId: string,
    input: UpdateOrderStatusInput,
) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new OrderError("Order not found", "not_found", 404);
    }

    const parsedInput = updateOrderStatusInputSchema.parse(input);
    const tenantIds = await resolveTenantIds(organizationSlug, locationSlug);
    const order = await OrderModel.findOne({
        ...tenantIds,
        _id: orderId,
    });

    if (!order) {
        throw new OrderError("Order not found", "not_found", 404);
    }

    const currentStatus = order.status as OrderStatus;

    if (!canTransitionOrderStatus(currentStatus, parsedInput.status)) {
        throw new OrderError(
            `Cannot transition order from ${currentStatus} to ${parsedInput.status}`,
            "invalid_transition",
            409,
        );
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
        {
            ...tenantIds,
            _id: orderId,
            status: currentStatus,
        },
        {
            $push: {
                statusHistory: {
                    fromStatus: currentStatus,
                    note: parsedInput.note,
                    toStatus: parsedInput.status,
                },
            },
            $set: {
                status: parsedInput.status,
            },
        },
        {
            new: true,
            runValidators: true,
        },
    ).lean();

    if (!updatedOrder) {
        throw new OrderError(
            "Order status was changed by another station",
            "conflict",
            409,
        );
    }

    const orderWithWorkflowStatus = await applyOrderStatusFromItems(
        tenantIds,
        updatedOrder,
    );

    return serializeOrder(orderWithWorkflowStatus);
}

export async function updateOrderItemStatusForLocation(
    organizationSlug: string,
    locationSlug: string,
    orderId: string,
    itemId: string,
    input: UpdateOrderItemStatusInput,
) {
    if (
        !mongoose.Types.ObjectId.isValid(orderId) ||
        !mongoose.Types.ObjectId.isValid(itemId)
    ) {
        throw new OrderError("Order item not found", "not_found", 404);
    }

    const parsedInput = updateOrderItemStatusInputSchema.parse(input);
    const tenantIds = await resolveTenantIds(organizationSlug, locationSlug);
    const order = await OrderModel.findOne({
        ...tenantIds,
        _id: orderId,
    });

    if (!order) {
        throw new OrderError("Order not found", "not_found", 404);
    }

    const item = order.items.id(itemId);

    if (!item) {
        throw new OrderError("Order item not found", "not_found", 404);
    }

    const currentStatus = item.status as OrderItemStatus;

    if (!canTransitionOrderItemStatus(currentStatus, parsedInput.status)) {
        throw new OrderError(
            `Cannot transition order item from ${currentStatus} to ${parsedInput.status}`,
            "invalid_transition",
            409,
        );
    }

    const now = new Date();
    const setPayload: Record<string, unknown> = {
        "items.$.status": parsedInput.status,
    };
    const unsetPayload: Record<string, string> = {};

    if (parsedInput.status === "ready") {
        setPayload["items.$.previousStatus"] = currentStatus;
        setPayload["items.$.readyAt"] = now;
    } else {
        unsetPayload["items.$.previousStatus"] = "";
        unsetPayload["items.$.readyAt"] = "";
    }

    if (parsedInput.status === "handed_off") {
        setPayload["items.$.handedOffAt"] = now;
    }

    if (parsedInput.status === "packed") {
        setPayload["items.$.packedAt"] = now;
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
        {
            ...tenantIds,
            _id: orderId,
            items: {
                $elemMatch: {
                    _id: itemId,
                    status: currentStatus,
                },
            },
        },
        Object.keys(unsetPayload).length > 0
            ? {
                  $set: setPayload,
                  $unset: unsetPayload,
              }
            : {
                  $set: setPayload,
              },
        {
            new: true,
            runValidators: true,
        },
    ).lean();

    if (!updatedOrder) {
        throw new OrderError(
            "Order item status was changed by another station",
            "conflict",
            409,
        );
    }

    const orderWithWorkflowStatus = await applyOrderStatusFromItems(
        tenantIds,
        updatedOrder,
    );

    return serializeOrder(orderWithWorkflowStatus);
}
