import { apiClient } from "./apiClient";
import type { Product } from "@/types/products";

export async function getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>("/products");

    return response.data;
}