import mongoose from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "../../../lib/mongodb";
import MenuGroupModel from "../model/MenuGroup";
import { menuGroupIcons } from "../model/menuGroupConstants";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

export const createMenuGroupInputSchema = z.object({
    organizationId: objectIdSchema,
    locationId: objectIdSchema,
    name: z.string().trim().min(1),
    icon: z.enum(menuGroupIcons),
});

export type CreateMenuGroupInput = z.input<typeof createMenuGroupInputSchema>;

export async function getMenuGroups(
    organizationId: string,
    locationId: string,
) {
    if (
        !mongoose.Types.ObjectId.isValid(organizationId) ||
        !mongoose.Types.ObjectId.isValid(locationId)
    ) {
        return [];
    }

    await connectToMongoDB();

    const groups = await MenuGroupModel.find({
        organizationId,
        locationId,
    })
        .sort({ name: 1 })
        .lean();

    return groups.map((group) => ({
        id: group._id.toString(),
        organizationId: group.organizationId.toString(),
        locationId: group.locationId.toString(),
        name: group.name,
        icon: group.icon,
    }));
}

export async function createMenuGroup(input: CreateMenuGroupInput) {
    const parsedInput = createMenuGroupInputSchema.parse(input);

    await connectToMongoDB();

    const group = await MenuGroupModel.create(parsedInput);

    return {
        id: group._id.toString(),
        organizationId: group.organizationId.toString(),
        locationId: group.locationId.toString(),
        name: group.name,
        icon: group.icon,
    };
}
