import mongoose from "mongoose";
import { z } from "zod";

import { createUser } from "@/features/users/lib/createUser";
import { getUsers } from "@/features/users/lib/getUsers";

export async function GET() {
    try {
        const users = await getUsers();

        return Response.json({ users });
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await createUser(body);

        return Response.json({ user }, { status: 201 });
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

        if (error instanceof mongoose.Error.ValidationError) {
            return Response.json(
                {
                    error: "Validation error",
                    message: error.message,
                },
                { status: 400 },
            );
        }

        if (isDuplicateKeyError(error)) {
            return Response.json(
                {
                    error: "User with this email already exists",
                },
                { status: 409 },
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

function isDuplicateKeyError(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
}
