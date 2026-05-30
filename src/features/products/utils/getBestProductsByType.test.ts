import { describe, expect, it } from "vitest";

import { getBestProductsByType } from "./getBestProductsByType";
import type { Product } from "@/types/products";

const createProduct = (
    id: number,
    type: Product["type"],
    bestRate: number,
): Product =>
    ({
        id,
        name: `Product ${id}`,
        type,
        bestRate,
    }) as Product;

describe("getBestProductsByType", () => {
    it("returns the fixed product with the lowest bestRate", () => {
        const products = [
            createProduct(1, "FIXED", 2.5),
            createProduct(2, "FIXED", 1.9),
            createProduct(3, "VARIABLE", 1.2),
        ];

        const result = getBestProductsByType(products, "FIXED");

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    });

    it("returns all products when multiple products share the lowest bestRate", () => {
        const products = [
            createProduct(1, "VARIABLE", 1.25),
            createProduct(2, "VARIABLE", 1.25),
            createProduct(3, "VARIABLE", 1.5),
        ];

        const result = getBestProductsByType(products, "VARIABLE");

        expect(result).toHaveLength(2);
        expect(result.map((product) => product.id)).toEqual([1, 2]);
    });

    it("returns an empty array when no products match the type", () => {
        const products = [createProduct(1, "FIXED", 2.1)];

        const result = getBestProductsByType(products, "VARIABLE");

        expect(result).toEqual([]);
    });
});