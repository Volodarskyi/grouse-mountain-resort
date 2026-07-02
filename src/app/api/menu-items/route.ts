import { z } from "zod";

import { createMenuItem } from "@/features/menu/lib/menuItems";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const menuItem = await createMenuItem(body);

        return Response.json({ menuItem }, { status: 201 });
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
