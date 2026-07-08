import { model, models, Schema, type InferSchemaType } from "mongoose";

import {
    productionAreas,
    type ProductionArea,
} from "../../workstations/model/workstationConstants";
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
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "MenuGroup",
            required: true,
        },
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
        productionArea: {
            type: String,
            enum: productionAreas,
            required: true,
        },
        defaultWorkstationId: {
            type: Schema.Types.ObjectId,
            ref: "Workstation",
        },
        price: {
            type: Number,
            required: true,
        },
        recipeId: {
            type: Schema.Types.ObjectId,
            ref: "Recipe",
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
export type { ProductionArea };

const MenuItemModel = models.MenuItem || model("MenuItem", menuItemSchema);

export default MenuItemModel;
