import { z } from "zod";

import {
    createMenuGroup,
    getMenuGroups,
} from "@/features/menu/lib/menuGroups";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const organizationId = url.searchParams.get("organizationId") ?? "";
    const locationId = url.searchParams.get("locationId") ?? "";

    const groups = await getMenuGroups(organizationId, locationId);

    return Response.json({ groups });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const group = await createMenuGroup(body);

        return Response.json({ group }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    error: "Validation error",
                    issues: error.issues,
                },
                { status: 400 },
            );
        }

        console.error(error);

        return Response.json(
            {
                error: "Internal server error",
            },
            { status: 500 },
        );
    }
}
