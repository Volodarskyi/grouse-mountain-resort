import { Ingredient, Recipe, recipes } from "../model/trainingData";

export const getRandomRecipe = (): Recipe => {
    const index = Math.floor(Math.random() * recipes.length);
    return recipes[index];
};

export const chunkIngredients = (
    items: Ingredient[],
    size: number,
): Ingredient[][] => {
    if (size <= 0) {
        throw new Error("Chunk size must be greater than 0");
    }

    const chunks: Ingredient[][] = [];

    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }

    return chunks;
};
