"use client";

import type { Product } from "@/types/products";
import type { Dictionary } from "@/i18n/getDictionary";

import styles from "./ProductsPage.module.css";

type ProductCardProps = {
    product: Product;
    dictionary: Dictionary;
    isPending: boolean;
    onSelect: (productId: number) => void;
};

export function ProductCard({
                                product,
                                dictionary,
                                isPending,
                                onSelect,
                            }: ProductCardProps) {
    const PRODUCT_TITLES: Record<Product["type"], string> = {
        FIXED: dictionary.products.bestFixed,
        VARIABLE: dictionary.products.bestVariable,
    };

    return (
        <article className={styles.card}>
            <div className={styles.cardContent}>
                <div>
                    <h2 className={styles.cardTitle}>
                        {PRODUCT_TITLES[product.type]}
                    </h2>

                    <p className={styles.cardType}>
                        ({product.type.toLowerCase()})
                    </p>
                </div>

                <p className={styles.productName}>
                    {product.name}
                </p>

                <p className={styles.rate}>
                    {product.bestRate}%
                </p>
            </div>

            <button
                type="button"
                className={styles.selectButton}
                disabled={isPending}
                aria-label={`Select ${product.name}`}
                onClick={() => onSelect(product.id)}
            >
                {isPending
                    ? dictionary.products.creating
                    : dictionary.products.selectProduct}
            </button>
        </article>
    );
}