"use client";

import Link from "next/link";

import type { Dictionary } from "@/i18n/getDictionary";
import { useProducts } from "@/features/products/hooks/useProducts";

import { useApplications } from "../hooks/useApplications";
import { getValidApplications } from "../utils/getValidApplications";

import styles from "./ApplicationsList.module.css";

type ApplicationsListPageProps = {
    lang: "en" | "fr";
    dictionary: Dictionary;
};

export function ApplicationsListPage({
                                         lang,
                                         dictionary,
                                     }: ApplicationsListPageProps) {
    const applicationsQuery = useApplications();
    const productsQuery = useProducts();

    const isLoading = applicationsQuery.isLoading || productsQuery.isLoading;
    const isError = applicationsQuery.isError || productsQuery.isError;

    if (isLoading) {
        return (
            <main className={styles.page}>
                <p>{dictionary.common.loading}</p>
            </main>
        );
    }

    if (isError || !applicationsQuery.data || !productsQuery.data) {
        return (
            <main className={styles.page}>
                <div className={styles.errorState}>
                    <h1>{dictionary.applications.errorTitle}</h1>

                    <button
                        className={styles.retryButton}
                        onClick={() => {
                            applicationsQuery.refetch();
                            productsQuery.refetch();
                        }}
                    >
                        {dictionary.products.retry}
                    </button>
                </div>
            </main>
        );
    }

    const validApplications = getValidApplications(applicationsQuery.data);

    return (
        <main className={styles.page}>
            <div className={styles.table}>
                <div className={styles.headerRow}>
                    <div>{dictionary.applications.table.name}</div>
                    <div>{dictionary.applications.table.email}</div>
                    <div>{dictionary.applications.table.phone}</div>
                    <div>{dictionary.applications.table.product}</div>
                    <div />
                </div>

                {validApplications.map((application) => {
                    const applicant = application.applicants[0];

                    const product = productsQuery.data.find(
                        (item) => item.id === application.productId,
                    );

                    return (
                        <div key={application.id} className={styles.row}>
                            <div className={styles.cell} data-label={dictionary.applications.table.name}>
                                {applicant.firstName} {applicant.lastName}
                            </div>

                            <div className={styles.cell} data-label={dictionary.applications.table.email}>
                                {applicant.email}
                            </div>

                            <div className={styles.cell} data-label={dictionary.applications.table.phone}>
                                {applicant.phone}
                            </div>

                            <div className={styles.cell} data-label={dictionary.applications.table.product}>
                                {product?.name ?? "-"}
                            </div>

                            <div className={styles.actionCell}>
                                <Link
                                    href={`/${lang}/applications/${application.id}/contact`}
                                    className={styles.editButton}
                                >
                                    {dictionary.applications.table.edit}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}