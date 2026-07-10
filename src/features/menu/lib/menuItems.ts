import mongoose from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "../../../lib/mongodb";
import LocationModel from "../../locations/model/Location";
import MenuGroupModel from "../model/MenuGroup";
import MenuItemModel from "../model/MenuItem";
import { menuItemStations } from "../model/menuItemConstants";
import OrganizationModel from "../../organizations/model/Organization";
import {
    getProductionAreaForStation,
    productionAreas,
} from "../../workstations/model/workstationConstants";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

export const createMenuItemInputSchema = z.object({
    organizationId: objectIdSchema,
    locationIds: z.array(objectIdSchema).min(1),
    groupId: objectIdSchema,
    name: z.string().trim().min(1),
    code: z.string().trim().min(1),
    description: z.string().trim().default(""),
    station: z.enum(menuItemStations),
    productionArea: z.enum(productionAreas).optional(),
    defaultWorkstationId: objectIdSchema.optional(),
    recipeId: objectIdSchema.optional(),
    price: z.number().min(0),
    calories: z.number().min(0).default(0),
    isActive: z.boolean().default(true),
});

export type CreateMenuItemInput = z.input<typeof createMenuItemInputSchema>;
export type UpdateMenuItemInput = CreateMenuItemInput;

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
    const menuGroups = await MenuGroupModel.find({
        organizationId: organization._id,
        locationId: location._id,
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
            description: menuItem.description ?? "",
            groupId: menuItem.groupId?.toString() ?? "",
            station: menuItem.station,
            productionArea: menuItem.productionArea,
            defaultWorkstationId: menuItem.defaultWorkstationId?.toString() ?? "",
            recipeId: menuItem.recipeId?.toString() ?? "",
            price: menuItem.price,
            calories: menuItem.calories ?? 0,
            isActive: menuItem.isActive,
            createdAt: menuItem.createdAt,
            updatedAt: menuItem.updatedAt,
        })),
        menuGroups: menuGroups.map((menuGroup) => ({
            id: menuGroup._id.toString(),
            name: menuGroup.name,
            icon: menuGroup.icon,
        })),
    };
}

export async function getMenuItemForEdit(menuItemId: string) {
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
        return null;
    }

    await connectToMongoDB();

    const menuItem = await MenuItemModel.findById(menuItemId).lean();

    if (!menuItem) {
        return null;
    }

    const locationIds =
        (menuItem.locationIds as Array<{ toString(): string }> | undefined) ?? [];

    return {
        id: menuItem._id.toString(),
        organizationId: menuItem.organizationId.toString(),
        locationIds: locationIds.map((locationId) => locationId.toString()),
        groupId: menuItem.groupId?.toString() ?? "",
        name: menuItem.name,
        code: menuItem.code,
        description: menuItem.description ?? "",
        station: menuItem.station,
        productionArea: menuItem.productionArea,
        defaultWorkstationId: menuItem.defaultWorkstationId?.toString() ?? "",
        recipeId: menuItem.recipeId?.toString() ?? "",
        price: menuItem.price,
        calories: menuItem.calories ?? 0,
        isActive: menuItem.isActive,
    };
}

export async function createMenuItem(input: CreateMenuItemInput) {
    const parsedInput = createMenuItemInputSchema.parse(input);
    const menuItemInput = {
        ...parsedInput,
        productionArea:
            parsedInput.productionArea ??
            getProductionAreaForStation(parsedInput.station),
    };

    await connectToMongoDB();

    const menuItem = await MenuItemModel.create(menuItemInput);
    const locationIds = menuItem.locationIds as Array<{ toString(): string }>;

    return {
        id: menuItem._id.toString(),
        organizationId: menuItem.organizationId.toString(),
        locationIds: locationIds.map((locationId) => locationId.toString()),
        groupId: menuItem.groupId?.toString() ?? parsedInput.groupId,
        name: menuItem.name,
        code: menuItem.code,
        description: menuItem.description ?? "",
        station: menuItem.station,
        productionArea: menuItem.productionArea,
        defaultWorkstationId: menuItem.defaultWorkstationId?.toString() ?? "",
        recipeId: menuItem.recipeId?.toString() ?? "",
        price: menuItem.price,
        calories: menuItem.calories ?? 0,
        isActive: menuItem.isActive,
        createdAt: menuItem.createdAt,
        updatedAt: menuItem.updatedAt,
    };
}

export async function updateMenuItem(
    menuItemId: string,
    input: UpdateMenuItemInput,
) {
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
        return null;
    }

    const parsedInput = createMenuItemInputSchema.parse(input);
    const menuItemInput = {
        ...parsedInput,
        productionArea:
            parsedInput.productionArea ??
            getProductionAreaForStation(parsedInput.station),
    };

    await connectToMongoDB();

    const menuItem = await MenuItemModel.findByIdAndUpdate(
        menuItemId,
        {
            $set: {
                ...menuItemInput,
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    );

    if (!menuItem) {
        return null;
    }

    const locationIds = menuItem.locationIds as Array<{ toString(): string }>;

    return {
        id: menuItem._id.toString(),
        organizationId: menuItem.organizationId.toString(),
        locationIds: locationIds.map((locationId) => locationId.toString()),
        groupId: menuItem.groupId?.toString() ?? parsedInput.groupId,
        name: menuItem.name,
        code: menuItem.code,
        description: menuItem.description ?? "",
        station: menuItem.station,
        productionArea: menuItem.productionArea,
        defaultWorkstationId: menuItem.defaultWorkstationId?.toString() ?? "",
        recipeId: menuItem.recipeId?.toString() ?? "",
        price: menuItem.price,
        calories: menuItem.calories ?? 0,
        isActive: menuItem.isActive,
        createdAt: menuItem.createdAt,
        updatedAt: menuItem.updatedAt,
    };
}

export async function deleteMenuItem(menuItemId: string) {
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
        return null;
    }

    await connectToMongoDB();

    const menuItem = await MenuItemModel.findByIdAndDelete(menuItemId);

    if (!menuItem) {
        return null;
    }

    return {
        id: menuItem._id.toString(),
    };
}
