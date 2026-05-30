"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { createApplication } from "@/api/applicationsApi";
import type { Dictionary } from "@/i18n/getDictionary";

import { useProducts } from "../hooks/useProducts";
import { getBestProductsByType } from "../utils/getBestProductsByType";
import { ProductCard } from "./ProductCard";

import styles from "./ProductsPage.module.css";

type ProductsPageProps = {
    lang: "en" | "fr";
    dictionary: Dictionary;
};

export function ProductsPage({ lang, dictionary }: ProductsPageProps) {
    const router = useRouter();
    const { data: products, isLoading, isError, refetch } = useProducts();

    const createApplicationMutation = useMutation({
        mutationFn: createApplication,
        onSuccess: (application) => {
            router.push(`/${lang}/applications/${application.id}/contact`);
        },
    });

    function handleSelectProduct(productId: number) {
        createApplicationMutation.mutate({ productId });
    }

    if (isLoading) {
        return (
            <main className={styles.page}>
                <section className={styles.grid}>
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                </section>
            </main>
        );
    }

    if (isError || !products) {
        return (
            <main className={styles.page}>
                <div className={styles.errorState}>
                    <h1 className={styles.errorTitle}>
                        {dictionary.products.errorTitle}
                    </h1>
                    <p className={styles.errorText}>
                        {dictionary.products.errorText}
                    </p>
                    <button className={styles.selectButton} onClick={() => refetch()}>
                        {dictionary.products.retry}
                    </button>
                </div>
            </main>
        );
    }

    const bestProducts = [
        ...getBestProductsByType(products, "FIXED"),
        ...getBestProductsByType(products, "VARIABLE"),
    ];

    return (
        <main className={styles.page}>
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    {dictionary.home.title}
                </h1>

                <p className={styles.heroSubtitle}>
                    {dictionary.home.subtitle}
                </p>
            </div>
            <section className={styles.grid}>
                {bestProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        dictionary={dictionary}
                        isPending={createApplicationMutation.isPending}
                        onSelect={handleSelectProduct}
                    />
                ))}
            </section>
        </main>
    );
}