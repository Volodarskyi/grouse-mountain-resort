import { model, models, Schema, type InferSchemaType } from "mongoose";

import { menuItemStations, type MenuItemStation } from "./menuItemConstants";

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

export type MenuItemDocument = InferSchemaType<typeof menuItemSchema>;
export type { MenuItemStation };

const MenuItemModel = models.MenuItem || model("MenuItem", menuItemSchema);

export default MenuItemModel;
