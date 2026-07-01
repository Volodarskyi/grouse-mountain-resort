import { describe, expect, it, vi } from "vitest";

import { ingredients, recipes } from "../model/trainingData";
import { chunkIngredients, getRandomRecipe } from "./trainingRecipe";

describe("trainingRecipe", () => {
    it("chunks ingredients by the requested size", () => {
        const chunks = chunkIngredients(ingredients.slice(0, 5), 2);

        expect(chunks).toEqual([
            ingredients.slice(0, 2),
            ingredients.slice(2, 4),
            ingredients.slice(4, 5),
        ]);
    });

    it("rejects invalid chunk sizes", () => {
        expect(() => chunkIngredients(ingredients, 0)).toThrow(
            "Chunk size must be greater than 0",
        );
    });

    it("selects a recipe by random index", () => {
        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

        expect(getRandomRecipe()).toBe(recipes[0]);

        randomSpy.mockRestore();
    });
});
