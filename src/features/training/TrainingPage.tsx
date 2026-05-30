"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
    Ingredient,
    Recipe,
    ingredients,
    recipes,
} from "./data/trainingData";

import "./TrainingPage.Styles.scss";

const getRandomRecipe = (): Recipe => {
    const index = Math.floor(Math.random() * recipes.length);
    return recipes[index];
};

export const TrainingPage = () => {
    const [recipe, setRecipe] = useState<Recipe>(getRandomRecipe);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [result, setResult] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
    const [extraIngredients, setExtraIngredients] = useState<string[]>([]);

    const selectedNames = useMemo(
        () => selectedIngredients.map((item) => item.name),
        [selectedIngredients]
    );

    const handleIngredientClick = (ingredient: Ingredient) => {
        if (selectedNames.includes(ingredient.name)) return;

        setSelectedIngredients((prev) => [...prev, ingredient]);
        setResult("");
        setMissingIngredients([]);
        setExtraIngredients([]);
        setShowAnswer(false);
    };

    const handleSelectedIngredientClick = (ingredientName: string) => {
        setSelectedIngredients((prev) =>
            prev.filter((item) => item.name !== ingredientName)
        );

        setResult("");
        setMissingIngredients([]);
        setExtraIngredients([]);
        setShowAnswer(false);
    };

    const handleDone = () => {
        const recipeNames = recipe.ingredients.map((item) => item.name);
        const currentNames = selectedIngredients.map((item) => item.name);

        const missing = recipeNames.filter((name) => !currentNames.includes(name));
        const extra = currentNames.filter((name) => !recipeNames.includes(name));

        setMissingIngredients(missing);
        setExtraIngredients(extra);

        const isCorrect = missing.length === 0 && extra.length === 0;

        setResult(isCorrect ? "Correct ✅" : "Incorrect ❌");
    };

    const handleNextRecipe = () => {
        setRecipe(getRandomRecipe());
        setSelectedIngredients([]);
        setResult("");
        setMissingIngredients([]);
        setExtraIngredients([]);
        setShowAnswer(false);
    };

    return (
        <main className="training-page">
            <div className="training-page__header">
                <span className="training-page__label">Build:</span>
                <h1 className="training-page__recipe-name">{recipe.title}</h1>
            </div>

            <section className="training-page__selected">
                <h2 className="training-page__section-title">Selected Ingredients</h2>

                <div className="training-page__burger-stack">
                    {selectedIngredients.length === 0 ? (
                        <p className="training-page__empty">Tap ingredients below</p>
                    ) : (
                        selectedIngredients.map((ingredient, index) => {
                            const isExtra = extraIngredients.includes(ingredient.name);

                            return (
                                <button
                                    key={ingredient.name}
                                    type="button"
                                    onClick={() => handleSelectedIngredientClick(ingredient.name)}
                                    className={`training-page__selected-layer ${
                                        isExtra ? "training-page__selected-layer--wrong" : ""
                                    }`}
                                    style={{ zIndex: selectedIngredients.length - index }}
                                >
                                    <Image
                                        src={ingredient.imgUrl}
                                        alt={ingredient.name}
                                        width={44}
                                        height={44}
                                        className="training-page__selected-image"
                                    />

                                    <span>{ingredient.name}</span>
                                </button>
                            );
                        })
                    )}
                </div>

                {missingIngredients.length > 0 && (
                    <div className="training-page__missing">
                        <h3 className="training-page__feedback-title">
                            Missing Ingredients
                        </h3>

                        <div className="training-page__missing-list">
                            {missingIngredients.map((name) => (
                                <div key={name} className="training-page__missing-item">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section className="training-page__ingredients">
                <h2 className="training-page__section-title">Ingredients</h2>

                <div className="training-page__grid">
                    {ingredients.map((ingredient) => {
                        const isSelected = selectedNames.includes(ingredient.name);

                        return (
                            <button
                                key={ingredient.name}
                                type="button"
                                onClick={() => handleIngredientClick(ingredient)}
                                className={`training-page__ingredient ${
                                    isSelected ? "training-page__ingredient--active" : ""
                                }`}
                            >
                                <Image
                                    src={ingredient.imgUrl}
                                    alt={ingredient.name}
                                    width={72}
                                    height={72}
                                    className="training-page__ingredient-image"
                                />
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="training-page__actions">
                <button
                    type="button"
                    onClick={handleDone}
                    className="training-page__button"
                >
                    Done
                </button>

                <button
                    type="button"
                    onClick={() => setShowAnswer((prev) => !prev)}
                    className="training-page__button training-page__button--secondary"
                >
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>

                <button
                    type="button"
                    onClick={handleNextRecipe}
                    className="training-page__button training-page__button--secondary"
                >
                    Next
                </button>
            </div>

            {result && <div className="training-page__result">{result}</div>}

            {showAnswer && (
                <section className="training-page__answer">
                    <h2 className="training-page__section-title">Correct Recipe</h2>

                    <div className="training-page__answer-list">
                        {recipe.ingredients.map((ingredient) => (
                            <div
                                key={ingredient.name}
                                className="training-page__answer-item"
                            >
                                <Image
                                    src={ingredient.imgUrl}
                                    alt={ingredient.name}
                                    width={44}
                                    height={44}
                                    className="training-page__answer-image"
                                />

                                <span>{ingredient.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};