import { z } from "zod";

export function createApplicantSchema(dictionary: {
    validation: {
        firstNameRequired: string;
        lastNameRequired: string;
        invalidEmail: string;
        invalidPhone: string;
    };
}) {
    return z.object({
        firstName: z
            .string()
            .min(1, dictionary.validation.firstNameRequired),

        lastName: z
            .string()
            .min(1, dictionary.validation.lastNameRequired),

        email: z
            .string()
            .email(dictionary.validation.invalidEmail),

        phone: z
            .string()
            .regex(/^\+?[0-9\s\-()]{7,20}$/, {
                message: dictionary.validation.invalidPhone,
            }),
    });
}

export type ApplicantFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};