import mongoose from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "../../../lib/mongodb";
import LocationModel from "../../locations/model/Location";
import MenuGroupModel from "../../menu/model/MenuGroup";
import { menuGroupIcons } from "../../menu/model/menuGroupConstants";
import MenuItemModel from "../../menu/model/MenuItem";
import { menuItemStations } from "../../menu/model/menuItemConstants";
import OrganizationModel from "../../organizations/model/Organization";
import RecipeModel from "../../recipes/model/Recipe";
import { productionAreas } from "../../workstations/model/workstationConstants";

const menuTransferVersion = 2;

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

const exportedMenuGroupSchema = z.object({
    name: z.string().trim().min(1),
    icon: z.string().trim().min(1),
});

const exportedMenuItemSchema = z.object({
    groupName: z.string().trim().min(1),
    name: z.string().trim().min(1),
    code: z.string().trim().min(1),
    station: z.enum(menuItemStations),
    productionArea: z.enum(productionAreas),
    price: z.number().min(0),
    recipeCode: z.string().trim().min(1).nullable().default(null),
    isActive: z.boolean().default(true),
});

export const importMenuTransferInputSchema = z.object({
    organizationId: objectIdSchema,
    locationId: objectIdSchema,
    data: z.object({
        schemaVersion: z.literal(menuTransferVersion),
        exportedAt: z.string().optional(),
        source: z
            .object({
                organization: z.object({
                    name: z.string(),
                    slug: z.string(),
                }),
                location: z.object({
                    name: z.string(),
                    slug: z.string(),
                }),
            })
            .optional(),
        groups: z.array(exportedMenuGroupSchema),
        menuItems: z.array(exportedMenuItemSchema),
    }),
});

export type ImportMenuTransferInput = z.input<
    typeof importMenuTransferInputSchema
>;

export async function getMenuTransferOptions() {
    await connectToMongoDB();

    const [organizations, locations] = await Promise.all([
        OrganizationModel.find({ status: "active" }).sort({ name: 1 }).lean(),
        LocationModel.find({ status: "active" }).sort({ name: 1 }).lean(),
    ]);

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

export async function exportRestaurantMenu(
    organizationId: string,
    locationId: string,
) {
    const parsedOrganizationId = objectIdSchema.parse(organizationId);
    const parsedLocationId = objectIdSchema.parse(locationId);

    await connectToMongoDB();

    const [organization, location] = await Promise.all([
        OrganizationModel.findById(parsedOrganizationId).lean(),
        LocationModel.findOne({
            _id: parsedLocationId,
            organizationId: parsedOrganizationId,
        }).lean(),
    ]);

    if (!organization || !location) {
        return null;
    }

    const [groups, menuItems, recipes] = await Promise.all([
        MenuGroupModel.find({
            organizationId: parsedOrganizationId,
            locationId: parsedLocationId,
        })
            .sort({ name: 1 })
            .lean(),
        MenuItemModel.find({
            organizationId: parsedOrganizationId,
            locationIds: parsedLocationId,
        })
            .sort({ name: 1 })
            .lean(),
        RecipeModel.find({
            organizationId: parsedOrganizationId,
        }).lean(),
    ]);

    const groupNameById = new Map(
        groups.map((group) => [group._id.toString(), group.name]),
    );
    const recipeCodeById = new Map(
        recipes.map((recipe) => [recipe._id.toString(), recipe.code]),
    );

    return {
        schemaVersion: menuTransferVersion,
        exportedAt: new Date().toISOString(),
        source: {
            organization: {
                name: organization.name,
                slug: organization.slug,
            },
            location: {
                name: location.name,
                slug: location.slug,
            },
        },
        groups: groups.map((group) => ({
            name: group.name,
            icon: group.icon,
        })),
        menuItems: menuItems.map((menuItem) => ({
            groupName: groupNameById.get(menuItem.groupId?.toString() ?? "") ?? "",
            name: menuItem.name,
            code: menuItem.code,
            station: menuItem.station,
            productionArea: menuItem.productionArea,
            price: menuItem.price,
            recipeCode: recipeCodeById.get(menuItem.recipeId?.toString() ?? "") ?? null,
            isActive: menuItem.isActive,
        })),
    };
}

export async function importRestaurantMenu(input: ImportMenuTransferInput) {
    const parsedInput = importMenuTransferInputSchema.parse(input);

    await connectToMongoDB();

    const [organization, location] = await Promise.all([
        OrganizationModel.findById(parsedInput.organizationId).lean(),
        LocationModel.findOne({
            _id: parsedInput.locationId,
            organizationId: parsedInput.organizationId,
        }).lean(),
    ]);

    if (!organization || !location) {
        return null;
    }

    const groupIdByName = new Map<string, string>();
    let groupsCreated = 0;
    let groupsUpdated = 0;

    for (const group of parsedInput.data.groups) {
        const icon = menuGroupIcons.includes(group.icon as (typeof menuGroupIcons)[number])
            ? group.icon
            : menuGroupIcons[0];
        const existingGroup = await MenuGroupModel.findOneAndUpdate(
            {
                organizationId: parsedInput.organizationId,
                locationId: parsedInput.locationId,
                name: group.name,
            },
            {
                $set: {
                    icon,
                },
                $setOnInsert: {
                    organizationId: parsedInput.organizationId,
                    locationId: parsedInput.locationId,
                    name: group.name,
                },
            },
            {
                returnDocument: "before",
                upsert: true,
            },
        );
        const resolvedGroup = await MenuGroupModel.findOne({
            organizationId: parsedInput.organizationId,
            locationId: parsedInput.locationId,
            name: group.name,
        }).lean();

        if (resolvedGroup) {
            groupIdByName.set(group.name, resolvedGroup._id.toString());
        }

        if (existingGroup) {
            groupsUpdated += 1;
        } else {
            groupsCreated += 1;
        }
    }

    let menuItemsCreated = 0;
    let menuItemsUpdated = 0;
    let menuItemsSkipped = 0;
    const recipeIdsByCode = new Map(
        (
            await RecipeModel.find({
                organizationId: parsedInput.organizationId,
            }).lean()
        ).map((recipe) => [recipe.code, recipe._id.toString()]),
    );

    for (const menuItem of parsedInput.data.menuItems) {
        const groupId = groupIdByName.get(menuItem.groupName);
        const recipeId = menuItem.recipeCode
            ? recipeIdsByCode.get(menuItem.recipeCode)
            : undefined;

        if (!groupId) {
            menuItemsSkipped += 1;
            continue;
        }

        const menuItemSet: Record<string, unknown> = {
            groupId,
            name: menuItem.name,
            station: menuItem.station,
            productionArea: menuItem.productionArea,
            price: menuItem.price,
            isActive: menuItem.isActive,
        };
        const recipeUnset = recipeId ? undefined : { recipeId: "" };

        if (recipeId) {
            menuItemSet.recipeId = recipeId;
        }

        const existingMenuItem = await MenuItemModel.findOneAndUpdate(
            {
                organizationId: parsedInput.organizationId,
                locationIds: parsedInput.locationId,
                code: menuItem.code,
            },
            {
                $set: menuItemSet,
                ...(recipeUnset ? { $unset: recipeUnset } : {}),
                $setOnInsert: {
                    organizationId: parsedInput.organizationId,
                    locationIds: [parsedInput.locationId],
                    code: menuItem.code,
                },
            },
            {
                returnDocument: "before",
                upsert: true,
                runValidators: true,
            },
        );

        if (existingMenuItem) {
            menuItemsUpdated += 1;
        } else {
            menuItemsCreated += 1;
        }
    }

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
        groupsCreated,
        groupsUpdated,
        menuItemsCreated,
        menuItemsUpdated,
        menuItemsSkipped,
    };
}
