"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateApplication } from "@/api/applicationsApi";
import type { Dictionary } from "@/i18n/getDictionary";

import {
    createApplicantSchema,
    type ApplicantFormValues,
} from "../schemas/applicantSchema";

import styles from "./ApplicationContactPage.module.css";

type ApplicationContactFormProps = {
    lang: "en" | "fr";
    applicationId: string;
    dictionary: Dictionary;
};

export function ApplicationContactForm({
                                           lang,
                                           applicationId,
                                           dictionary,
                                       }: ApplicationContactFormProps) {
    const router = useRouter();

    const [isSaved, setIsSaved] = useState(false);

    const applicantSchema = createApplicantSchema(dictionary);

    const updateApplicationMutation = useMutation({
        mutationFn: (values: ApplicantFormValues) =>
            updateApplication(applicationId, {
                applicants: [
                    {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phone: values.phone,
                    },
                ],
            }),

        onSuccess: () => {
            setIsSaved(true);

            setTimeout(() => {
                router.push(`/${lang}/applications`);
            }, 1200);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicantFormValues>({
        resolver: zodResolver(applicantSchema),

        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit(values: ApplicantFormValues) {
        await updateApplicationMutation.mutateAsync(values);
    }

    return (
        <>
            <h2 className={styles.formTitle}>
                {dictionary.applicationForm.title}
            </h2>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="firstName">
                        {dictionary.applicationForm.firstName}
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        className={styles.input}
                        placeholder={dictionary.applicationForm.firstNamePlaceholder}
                        {...register("firstName")}
                    />

                    {errors.firstName && (
                        <p className={styles.error}>
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="lastName">
                        {dictionary.applicationForm.lastName}
                    </label>

                    <input
                        id="lastName"
                        type="text"
                        className={styles.input}
                        placeholder={dictionary.applicationForm.lastNamePlaceholder}
                        {...register("lastName")}
                    />

                    {errors.lastName && (
                        <p className={styles.error}>
                            {errors.lastName.message}
                        </p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                        {dictionary.applicationForm.email}
                    </label>

                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        placeholder={dictionary.applicationForm.emailPlaceholder}
                        {...register("email")}
                        disabled={true}
                    />

                    {errors.email && (
                        <p className={styles.error}>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">
                        {dictionary.applicationForm.phone}
                    </label>

                    <input
                        id="phone"
                        type="tel"
                        className={styles.input}
                        placeholder={dictionary.applicationForm.phonePlaceholder}
                        {...register("phone")}
                    />

                    {errors.phone && (
                        <p className={styles.error}>
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={updateApplicationMutation.isPending}
                >
                    {updateApplicationMutation.isPending
                        ? dictionary.common.loading
                        : dictionary.applicationForm.save}
                </button>

                {isSaved && (
                    <p className={styles.successMessage}>
                        {dictionary.applicationForm.saved}
                    </p>
                )}

                {updateApplicationMutation.isError && (
                    <p className={styles.errorMessage}>
                        {dictionary.applicationForm.saveError}
                    </p>
                )}
            </form>
        </>
    );
}