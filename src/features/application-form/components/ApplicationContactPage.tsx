"use client";

import type { Dictionary } from "@/i18n/getDictionary";

import { useProducts } from "@/features/products/hooks/useProducts";
import { SelectedProductCard } from "./SelectedProductCard";

import { useApplication } from "../hooks/useApplication";
import { ApplicationContactForm } from "./ApplicationContactForm";

import styles from "./ApplicationContactPage.module.css";

type ApplicationContactPageProps = {
    lang: "en" | "fr";
    applicationId: string;
    dictionary: Dictionary;
};

export function ApplicationContactPage({
                                           lang,
                                           applicationId,
                                           dictionary,
                                       }: ApplicationContactPageProps) {
    const {
        data: application,
        isLoading: isApplicationLoading,
        isError: isApplicationError,
    } = useApplication(applicationId);

    const {
        data: products,
        isLoading: isProductsLoading,
        isError: isProductsError,
    } = useProducts();

    const isLoading = isApplicationLoading || isProductsLoading;
    const isError = isApplicationError || isProductsError;

    const selectedProduct = products?.find(
        (product) => product.id === application?.productId,
    );

    if (isLoading) {
        return (
            <main className={styles.page}>
                <p>{dictionary.common.loading}</p>
            </main>
        );
    }

    if (isError || !application || !selectedProduct) {
        return (
            <main className={styles.page}>
                <p>{dictionary.common.error}</p>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.layout}>
                <SelectedProductCard
                    product={selectedProduct}
                    dictionary={dictionary}
                />

                <section className={styles.formCard}>
                    <ApplicationContactForm
                        lang={lang}
                        applicationId={applicationId}
                        dictionary={dictionary}
                    />
                </section>
            </div>
        </main>
    );
}