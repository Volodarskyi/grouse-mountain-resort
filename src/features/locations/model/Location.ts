import { model, models, Schema, type InferSchemaType } from "mongoose";

export const locationTypes = ["restaurant", "fast_food", "cafe", "bar"] as const;
export const locationStatuses = ["active", "inactive"] as const;

const locationSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
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
        address: {
            type: String,
            required: true,
            trim: true,
        },
        timezone: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: locationTypes,
            required: true,
        },
        status: {
            type: String,
            enum: locationStatuses,
            default: "active",
        },
    },
    {
        timestamps: true,
    },
);

export type LocationType = (typeof locationTypes)[number];
export type LocationStatus = (typeof locationStatuses)[number];
export type LocationDocument = InferSchemaType<typeof locationSchema>;

const LocationModel = models.Location || model("Location", locationSchema);

export default LocationModel;
