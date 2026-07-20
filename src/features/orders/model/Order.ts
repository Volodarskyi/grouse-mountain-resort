import { model, models, Schema, type InferSchemaType } from "mongoose";

import { productionAreas } from "../../workstations/model/workstationConstants";

export const orderStatuses = [
    "submitted",
    "accepted",
    "in_progress",
    "assembling",
    "ready",
    "ready_for_pickup",
    "completed",
    "cancelled",
] as const;

export const orderItemStatuses = [
    "queued",
    "claimed",
    "preparing",
    "ready",
    "handed_off",
    "packed",
    "cancelled",
] as const;

export const orderSources = ["staff", "public"] as const;

const orderItemModificationSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            min: 1,
        },
        type: {
            type: String,
            enum: ["added", "removed"],
            required: true,
        },
    },
    {
        _id: false,
    },
);

const orderStatusHistorySchema = new Schema(
    {
        fromStatus: {
            type: String,
            enum: orderStatuses,
        },
        toStatus: {
            type: String,
            enum: orderStatuses,
            required: true,
        },
        changedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        note: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        _id: false,
    },
);

const orderItemSchema = new Schema(
    {
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        nameSnapshot: {
            type: String,
            required: true,
            trim: true,
        },
        priceSnapshot: {
            type: Number,
            required: true,
            min: 0,
        },
        station: {
            type: String,
            trim: true,
            default: "",
        },
        productionArea: {
            type: String,
            enum: productionAreas,
            required: true,
        },
        workstationId: {
            type: Schema.Types.ObjectId,
            ref: "Workstation",
        },
        workstationNameSnapshot: {
            type: String,
            trim: true,
            default: "",
        },
        imageUrlSnapshot: {
            type: String,
            trim: true,
            default: "",
        },
        modifications: {
            type: [orderItemModificationSchema],
            default: [],
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: orderItemStatuses,
            default: "queued",
        },
        previousStatus: {
            type: String,
            enum: orderItemStatuses,
        },
        claimedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        preparedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        readyAt: {
            type: Date,
        },
        handedOffAt: {
            type: Date,
        },
        packedAt: {
            type: Date,
        },
    },
    {
        _id: true,
    },
);

const orderSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        locationId: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            trim: true,
        },
        businessDate: {
            type: String,
            required: true,
            trim: true,
        },
        clientRequestId: {
            type: String,
            trim: true,
        },
        customerName: {
            type: String,
            trim: true,
            default: "",
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
        source: {
            type: String,
            enum: orderSources,
            default: "staff",
        },
        status: {
            type: String,
            enum: orderStatuses,
            default: "submitted",
        },
        createdByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        acceptedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        completedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        issuedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        cancelledByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        total: {
            type: Number,
            default: 0,
            min: 0,
        },
        items: {
            type: [orderItemSchema],
            default: [],
        },
        statusHistory: {
            type: [orderStatusHistorySchema],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

orderSchema.index(
    { organizationId: 1, locationId: 1, businessDate: 1, orderNumber: 1 },
    { unique: true },
);
orderSchema.index(
    { organizationId: 1, locationId: 1, clientRequestId: 1 },
    {
        unique: true,
        partialFilterExpression: { clientRequestId: { $type: "string" } },
    },
);
orderSchema.index({ organizationId: 1, locationId: 1, status: 1, updatedAt: -1 });
orderSchema.index({
    organizationId: 1,
    locationId: 1,
    businessDate: 1,
    status: 1,
    updatedAt: -1,
});

export type OrderStatus = (typeof orderStatuses)[number];
export type OrderItemStatus = (typeof orderItemStatuses)[number];
export type OrderSource = (typeof orderSources)[number];
export type OrderDocument = InferSchemaType<typeof orderSchema>;

const OrderModel = models.Order || model("Order", orderSchema);

export default OrderModel;
