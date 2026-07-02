import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import { connectToMongoDB } from "../../../lib/mongodb";
import { User, userStatuses } from "../model/User";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
    });

export const createUserInputSchema = z.object({
    firstName: z.string().trim().min(1),
    secondName: z.string().trim().min(1),
    phone: z.string().trim().default(""),
    email: z.email().transform((value) => value.toLowerCase()),
    password: z.string().min(8),
    role: z.string().trim().min(1).optional(),
    organizationId: objectIdSchema.optional(),
    locations: z.array(objectIdSchema).optional(),
    departmentId: objectIdSchema.optional(),
    skills: z
        .array(
            z.object({
                name: z.string().trim().min(1),
                rank: z.number().int().min(0).max(10),
            }),
        )
        .default([]),
    status: z.enum(userStatuses).default("new"),
});

export type CreateUserInput = z.input<typeof createUserInputSchema>;

export async function createUser(input: CreateUserInput) {
    const parsedInput = createUserInputSchema.parse(input);
    const password = await bcrypt.hash(parsedInput.password, 12);

    await connectToMongoDB();

    const user = await User.create({
        ...parsedInput,
        password,
    });
    const locations =
        (user.locations as Array<{ toString(): string }> | undefined) ?? [];

    return {
        id: user._id.toString(),
        firstName: user.firstName,
        secondName: user.secondName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId?.toString(),
        locations: locations.map((locationId) => locationId.toString()),
        departmentId: user.departmentId?.toString(),
        skills: user.skills,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
