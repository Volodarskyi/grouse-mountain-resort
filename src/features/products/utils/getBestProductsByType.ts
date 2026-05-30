import type { Product } from "@/types/products";

export function getBestProductsByType(
    products: Product[],
    type: Product["type"],
): Product[] {
    const filteredProducts = products.filter((product) => product.type === type);

    if (filteredProducts.length === 0) {
        return [];
    }

    const lowestBestRate = Math.min(
        ...filteredProducts.map((product) => product.bestRate),
    );

    return filteredProducts.filter(
        (product) => product.bestRate === lowestBestRate,
    );
}