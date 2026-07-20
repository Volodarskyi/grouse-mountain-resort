import { z } from "zod";

import {
    OrderError,
    updateOrderItemStatusForLocation,
} from "@/features/orders/lib/orders";

type OrderItemRouteContext = {
    params: Promise<{
        itemId: string;
        locationSlug: string;
        orderId: string;
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

export async function PATCH(request: Request, context: OrderItemRouteContext) {
    try {
        const { itemId, locationSlug, orderId, organizationSlug } =
            await context.params;
        const body = await request.json();
        const order = await updateOrderItemStatusForLocation(
            organizationSlug,
            locationSlug,
            orderId,
            itemId,
            body,
        );

        return Response.json({ order });
    } catch (error) {
        return getErrorResponse(error);
    }
}
