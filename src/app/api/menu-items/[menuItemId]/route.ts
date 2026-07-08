import { z } from "zod";

import {
    deleteMenuItem,
    updateMenuItem,
} from "@/features/menu/lib/menuItems";

type MenuItemRouteContext = {
    params: Promise<{
        menuItemId: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: MenuItemRouteContext,
) {
    try {
        const { menuItemId } = await params;
        const body = await request.json();
        const menuItem = await updateMenuItem(menuItemId, body);

        if (!menuItem) {
            return Response.json(
                {
                    error: "Menu item not found",
                },
                { status: 404 },
            );
        }

        return Response.json({ menuItem });
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

export async function DELETE(
    _request: Request,
    { params }: MenuItemRouteContext,
) {
    try {
        const { menuItemId } = await params;
        const menuItem = await deleteMenuItem(menuItemId);

        if (!menuItem) {
            return Response.json(
                {
                    error: "Menu item not found",
                },
                { status: 404 },
            );
        }

        return Response.json({ menuItem });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Internal server error",
            },
            { status: 500 },
        );
    }
}
