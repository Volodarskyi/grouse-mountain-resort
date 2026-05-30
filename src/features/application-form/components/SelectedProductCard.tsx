import type { Product } from "@/types/products";
import type { Dictionary } from "@/i18n/getDictionary";

import styles from "./ApplicationContactPage.module.css";

type SelectedProductCardProps = {
    product: Product;
    dictionary: Dictionary;
};

export function SelectedProductCard({
                                        product,
                                        dictionary,
                                    }: SelectedProductCardProps) {
    const title =
        product.type === "FIXED"
            ? dictionary.products.bestFixed
            : dictionary.products.bestVariable;

    return (
        <article className={styles.productCard}>
            <div>
                <h2 className={styles.productTitle}>{title}</h2>
                <p className={styles.productType}>({product.type.toLowerCase()})</p>
            </div>

            <p className={styles.productName}>{product.name}</p>

            <p className={styles.productRate}>{product.bestRate}%</p>
        </article>
    );
}