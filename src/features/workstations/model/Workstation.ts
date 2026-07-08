import { model, models, Schema, type InferSchemaType } from "mongoose";

import { productionAreas, workstationStatuses } from "./workstationConstants";

const workstationSchema = new Schema(
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
        slug: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        productionArea: {
            type: String,
            enum: productionAreas,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: workstationStatuses,
            default: "active",
        },
    },
    {
        timestamps: true,
    },
);

workstationSchema.index(
    { organizationId: 1, locationId: 1, slug: 1 },
    { unique: true },
);
workstationSchema.index({ organizationId: 1, locationId: 1, productionArea: 1 });

export type WorkstationDocument = InferSchemaType<typeof workstationSchema>;

const WorkstationModel =
    models.Workstation || model("Workstation", workstationSchema);

export default WorkstationModel;
