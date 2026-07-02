import { describe, expect, it } from "vitest";

import { createUserInputSchema } from "./createUser";

describe("createUserInputSchema", () => {
    const validInput = {
        firstName: "Alex",
        secondName: "Taylor",
        phone: "+16045550123",
        email: "ALEX@example.com",
        password: "password123",
    };

    it("normalizes email and applies the default status", () => {
        const result = createUserInputSchema.parse(validInput);

        expect(result.email).toBe("alex@example.com");
        expect(result.status).toBe("new");
        expect(result.skills).toEqual([]);
    });

    it("accepts skills ranked from 0 to 10", () => {
        const result = createUserInputSchema.parse({
            ...validInput,
            skills: [
                {
                    name: "Grill",
                    rank: 10,
                },
            ],
        });

        expect(result.skills).toEqual([{ name: "Grill", rank: 10 }]);
    });

    it("rejects skills ranked outside of 0 to 10", () => {
        const result = createUserInputSchema.safeParse({
            ...validInput,
            skills: [
                {
                    name: "Prep",
                    rank: 11,
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects invalid object references", () => {
        const result = createUserInputSchema.safeParse({
            ...validInput,
            organizationId: "org_grouse",
        });

        expect(result.success).toBe(false);
    });
});
