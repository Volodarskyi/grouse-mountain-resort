import { model, models, Schema, type InferSchemaType } from "mongoose";

import type { MenuGroupIcon } from "./menuGroupConstants";

const menuGroupSchema = new Schema(
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
        name: {
            type: String,
            required: true,
            trim: true,
        },
        icon: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export type MenuGroupDocument = InferSchemaType<typeof menuGroupSchema>;
export type { MenuGroupIcon };

const MenuGroupModel =
    models.MenuGroup || model("MenuGroup", menuGroupSchema);

export default MenuGroupModel;
