import { model, models, Schema, type InferSchemaType } from "mongoose";

const orderCounterSchema = new Schema(
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
        businessDate: {
            type: String,
            required: true,
            trim: true,
        },
        sequence: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

orderCounterSchema.index(
    { organizationId: 1, locationId: 1, businessDate: 1 },
    { unique: true },
);

export type OrderCounterDocument = InferSchemaType<typeof orderCounterSchema>;

const OrderCounterModel =
    models.OrderCounter || model("OrderCounter", orderCounterSchema);

export default OrderCounterModel;
