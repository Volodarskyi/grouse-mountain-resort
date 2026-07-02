import { model, models, Schema, type InferSchemaType } from "mongoose";

export const menuItemStations = [
    "front_desk",
    "grill",
    "kitchen",
    "bar",
    "expo",
] as const;

const menuItemSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        locationIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Location",
            },
        ],
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            trim: true,
        },
        station: {
            type: String,
            enum: menuItemStations,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        ingredients: {
            type: [Schema.Types.Mixed],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export type MenuItemStation = (typeof menuItemStations)[number];
export type MenuItemDocument = InferSchemaType<typeof menuItemSchema>;

const MenuItemModel = models.MenuItem || model("MenuItem", menuItemSchema);

export default MenuItemModel;
