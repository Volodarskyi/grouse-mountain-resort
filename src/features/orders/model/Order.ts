import { model, models, Schema, type InferSchemaType } from "mongoose";

export const orderStatuses = [
    "submitted",
    "in_progress",
    "ready",
    "completed",
    "cancelled",
] as const;

const orderItemSchema = new Schema(
    {
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
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
        status: {
            type: String,
            enum: orderStatuses,
            default: "submitted",
        },
        items: {
            type: [orderItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export type OrderStatus = (typeof orderStatuses)[number];
export type OrderDocument = InferSchemaType<typeof orderSchema>;

const OrderModel = models.Order || model("Order", orderSchema);

export default OrderModel;
