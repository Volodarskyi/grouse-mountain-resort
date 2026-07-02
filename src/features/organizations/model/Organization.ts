import { model, models, Schema, type InferSchemaType } from "mongoose";

export const organizationStatuses = ["active", "inactive"] as const;

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        defaultLocationSlug: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: organizationStatuses,
            default: "active",
        },
    },
    {
        timestamps: true,
    },
);

export type OrganizationStatus = (typeof organizationStatuses)[number];
export type OrganizationDocument = InferSchemaType<typeof organizationSchema>;

const OrganizationModel =
    models.Organization || model("Organization", organizationSchema);

export default OrganizationModel;
