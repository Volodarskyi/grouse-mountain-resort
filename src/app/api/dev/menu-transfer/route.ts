import { ZodError } from "zod";

import {
    exportRestaurantMenu,
    getMenuTransferOptions,
    importRestaurantMenu,
} from "@/features/dev/lib/menuTransfer";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const action = url.searchParams.get("action");

        if (action === "export") {
            const organizationId = url.searchParams.get("organizationId") ?? "";
            const locationId = url.searchParams.get("locationId") ?? "";
            const menuTransfer = await exportRestaurantMenu(
                organizationId,
                locationId,
            );

            if (!menuTransfer) {
                return Response.json(
                    { error: "Organization or location was not found" },
                    { status: 404 },
                );
            }

            return Response.json({ menuTransfer });
        }

        const options = await getMenuTransferOptions();

        return Response.json({ options });
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(
                { error: "Invalid menu transfer request", details: error.issues },
                { status: 400 },
            );
        }

        console.error(error);

        return Response.json(
            {
                error: "Menu transfer request failed",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await importRestaurantMenu(body);

        if (!result) {
            return Response.json(
                { error: "Organization or location was not found" },
                { status: 404 },
            );
        }

        return Response.json({ result }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(
                { error: "Invalid menu transfer JSON", details: error.issues },
                { status: 400 },
            );
        }

        console.error(error);

        return Response.json(
            {
                error: "Menu transfer import failed",
            },
            { status: 500 },
        );
    }
}
