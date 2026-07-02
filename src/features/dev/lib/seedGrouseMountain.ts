import { connectToMongoDB } from "../../../lib/mongodb";
import LocationModel, {
    type LocationType,
} from "../../locations/model/Location";
import OrganizationModel from "../../organizations/model/Organization";

const grouseMountainAddress = "6400 Nancy Greene Way, North Vancouver, BC";

const organizationSeed = {
    slug: "grouse-mountain",
    name: "Grouse Mountain Resort",
    defaultLocationSlug: "rusty-rail",
    status: "active",
} as const;

const locationSeeds: Array<{
    slug: string;
    name: string;
    address: string;
    timezone: string;
    imageUrl: string;
    type: LocationType;
    status: "active";
}> = [
    {
        slug: "rusty-rail",
        name: "Rusty Rail",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "https://www.grousemountain.com/media/W1siZiIsIjIwMTgvMTEvMDEvMTUvNDEvNTUvZTk3NmFkYzQtY2NjYy00NGFmLWFhNjYtOWQxYjc0MjMxOGY5L1J1c3R5LXJhaWwtYmJxLmpwZyJdLFsicCIsInRodW1iIiwiOTYweDQ3MCMiXV0?sha=ca663a6faccae9db",
        type: "fast_food",
        status: "active",
    },
    {
        slug: "altitudes-bistro",
        name: "Altitudes Bistro",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "https://www.grousemountain.com/media/W1siZiIsIjIwMTgvMDQvMTAvMTIvMjcvMDEvMGI5YTYzNjMtMzBkMi00NzAyLTlkYTMtMDM1NjA1NzJmMGMyL2FsdGl0dWRlcy1kaW5pbmdyb29tLmpwZyJdLFsicCIsInRodW1iIiwiOTYweDQ3MFx1MDAzZSJdXQ?sha=59dde6d97eaa8820",
        type: "restaurant",
        status: "active",
    },
    {
        slug: "the-observatory",
        name: "The Observatory",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "https://www.grousemountain.com/media/W1siZiIsIjIwMTcvMDEvMzAvMjIvMzUvMzEvODA4YjJiMmYtMTc1My00ZWFjLTkwNDktZjlkMWEwMTMzNmE1L29ic2VydmF0b3J5LXdpbmRvd3MuanBnIl0sWyJwIiwidGh1bWIiLCI5NjB4NDcwIyJdXQ?sha=56789f8e5ae5c9a1",
        type: "restaurant",
        status: "active",
    },
    {
        slug: "lupins",
        name: "Lupin's Cafe",
        address: grouseMountainAddress,
        timezone: "America/Vancouver",
        imageUrl:
            "https://www.grousemountain.com/media/W1siZiIsIjIwMTgvMTEvMDEvMTAvMDMvNTkvYjNiYzhmMTQtZmY1OS00YTVjLWJkMGUtOTE2OThhYmFiMmE2L0x1cGlucy13ZWIuanBnIl1d?sha=88c5155af70fec4c",
        type: "fast_food",
        status: "active",
    },
];

export async function seedGrouseMountain() {
    await connectToMongoDB();

    const organization = await OrganizationModel.findOneAndUpdate(
        { slug: organizationSeed.slug },
        { $set: organizationSeed },
        {
            new: true,
            setDefaultsOnInsert: true,
            upsert: true,
        },
    );

    const locations = await Promise.all(
        locationSeeds.map((locationSeed) =>
            LocationModel.findOneAndUpdate(
                {
                    organizationId: organization._id,
                    slug: locationSeed.slug,
                },
                {
                    $set: {
                        ...locationSeed,
                        organizationId: organization._id,
                    },
                },
                {
                    new: true,
                    setDefaultsOnInsert: true,
                    upsert: true,
                },
            ),
        ),
    );

    return {
        organization: {
            id: organization._id.toString(),
            slug: organization.slug,
            name: organization.name,
            defaultLocationSlug: organization.defaultLocationSlug,
            status: organization.status,
        },
        locations: locations.map((location) => ({
            id: location._id.toString(),
            organizationId: location.organizationId.toString(),
            slug: location.slug,
            name: location.name,
            address: location.address,
            timezone: location.timezone,
            imageUrl: location.imageUrl,
            type: location.type,
            status: location.status,
        })),
    };
}
