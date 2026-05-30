import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });
}