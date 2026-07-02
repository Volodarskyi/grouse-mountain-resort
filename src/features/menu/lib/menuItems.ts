import mongoose from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "../../../lib/mongodb";
import LocationModel from "../../locations/model/Location";
import MenuItemModel from "../model/MenuItem";
import { menuItemStations } from "../model/menuItemConstants";
import OrganizationModel from "../../organizations/model/Organization";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

export const createMenuItemInputSchema = z.object({
    organizationId: objectIdSchema,
    locationIds: z.array(objectIdSchema).min(1),
    name: z.string().trim().min(1),
    code: z.string().trim().min(1),
    station: z.enum(menuItemStations),
    price: z.number().min(0),
    isActive: z.boolean().default(true),
});

export type CreateMenuItemInput = z.input<typeof createMenuItemInputSchema>;

export async function getMenuItemsForLocation(
    organizationSlug: string,
    locationSlug: string,
) {
    await connectToMongoDB();

    const organization = await OrganizationModel.findOne({
        slug: organizationSlug,
    }).lean();

    if (!organization) {
        return null;
    }

    const location = await LocationModel.findOne({
        organizationId: organization._id,
        slug: locationSlug,
    }).lean();

    if (!location) {
        return null;
    }

    const menuItems = await MenuItemModel.find({
        organizationId: organization._id,
        locationIds: location._id,
    })
        .sort({ name: 1 })
        .lean();

    return {
        organization: {
            id: organization._id.toString(),
            name: organization.name,
            slug: organization.slug,
        },
        location: {
            id: location._id.toString(),
            name: location.name,
            slug: location.slug,
        },
        menuItems: menuItems.map((menuItem) => ({
            id: menuItem._id.toString(),
            name: menuItem.name,
            code: menuItem.code,
            station: menuItem.station,
            price: menuItem.price,
            isActive: menuItem.isActive,
            createdAt: menuItem.createdAt,
            updatedAt: menuItem.updatedAt,
        })),
    };
}

export async function getMenuItemFormOptions() {
    await connectToMongoDB();

    const organizations = await OrganizationModel.find({ status: "active" })
        .sort({ name: 1 })
        .lean();

    const locations = await LocationModel.find({ status: "active" })
        .sort({ name: 1 })
        .lean();

    return {
        organizations: organizations.map((organization) => ({
            id: organization._id.toString(),
            name: organization.name,
            slug: organization.slug,
        })),
        locations: locations.map((location) => ({
            id: location._id.toString(),
            organizationId: location.organizationId.toString(),
            name: location.name,
            slug: location.slug,
        })),
    };
}

export async function createMenuItem(input: CreateMenuItemInput) {
    const parsedInput = createMenuItemInputSchema.parse(input);

    await connectToMongoDB();

    const menuItem = await MenuItemModel.create({
        ...parsedInput,
        ingredients: [],
    });
    const locationIds = menuItem.locationIds as Array<{ toString(): string }>;

    return {
        id: menuItem._id.toString(),
        organizationId: menuItem.organizationId.toString(),
        locationIds: locationIds.map((locationId) => locationId.toString()),
        name: menuItem.name,
        code: menuItem.code,
        station: menuItem.station,
        price: menuItem.price,
        isActive: menuItem.isActive,
        createdAt: menuItem.createdAt,
        updatedAt: menuItem.updatedAt,
    };
}
