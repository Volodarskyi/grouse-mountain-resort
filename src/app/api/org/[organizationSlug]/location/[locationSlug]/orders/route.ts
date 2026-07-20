import { z } from "zod";

import {
    createOrderForLocation,
    getActiveOrdersForLocation,
    OrderError,
} from "@/features/orders/lib/orders";

type OrdersRouteContext = {
    params: Promise<{
        locationSlug: string;
        organizationSlug: string;
    }>;
};

function getErrorResponse(error: unknown) {
    if (error instanceof z.ZodError) {
        return Response.json(
            {
                error: "Validation error",
                issues: error.issues,
            },
            { status: 400 },
        );
    }

    if (error instanceof OrderError) {
        return Response.json(
            {
                code: error.code,
                error: error.message,
            },
            { status: error.status },
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

export async function GET(_request: Request, context: OrdersRouteContext) {
    try {
        const { locationSlug, organizationSlug } = await context.params;
        const orders = await getActiveOrdersForLocation(
            organizationSlug,
            locationSlug,
        );

        return Response.json({ orders });
    } catch (error) {
        return getErrorResponse(error);
    }
}

export async function POST(request: Request, context: OrdersRouteContext) {
    try {
        const { locationSlug, organizationSlug } = await context.params;
        const body = await request.json();
        const order = await createOrderForLocation(
            organizationSlug,
            locationSlug,
            body,
        );

        return Response.json({ order }, { status: 201 });
    } catch (error) {
        return getErrorResponse(error);
    }
}
