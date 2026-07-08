import { model, models, Schema, type InferSchemaType } from "mongoose";

import { shiftStatuses } from "./shiftConstants";

const shiftSchema = new Schema(
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
        status: {
            type: String,
            enum: shiftStatuses,
            default: "planned",
        },
        startedAt: {
            type: Date,
        },
        closedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

shiftSchema.index(
    { organizationId: 1, locationId: 1, businessDate: 1 },
    { unique: true },
);

export type ShiftDocument = InferSchemaType<typeof shiftSchema>;

const ShiftModel = models.Shift || model("Shift", shiftSchema);

export default ShiftModel;
