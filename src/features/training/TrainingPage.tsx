"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
    const [recipe, setRecipe] = useState<Recipe>(recipes[0]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [result, setResult] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
    const [extraIngredients, setExtraIngredients] = useState<string[]>([]);

    useEffect(() => {
        setRecipe(getRandomRecipe());
    }, []);

    const selectedCodes = useMemo(
        () => selectedIngredients.map((item) => item.code),
        [selectedIngredients]
    );

    const resetCheckState = () => {
        setResult("");
        setMissingIngredients([]);
        setExtraIngredients([]);
        setShowAnswer(false);
    };

    const handleIngredientClick = (ingredient: Ingredient) => {
        setSelectedIngredients((prev) => {
            const isSelected = prev.some((item) => item.code === ingredient.code);

            if (isSelected) {
                return prev.filter((item) => item.code !== ingredient.code);
            }

            return [...prev, ingredient];
        });

        resetCheckState();
    };

    const handleDone = () => {
        const recipeCodes = recipe.ingredients.map((item) => item.code);
        const currentCodes = selectedIngredients.map((item) => item.code);

        const missing = recipe.ingredients
            .filter((item) => !currentCodes.includes(item.code))
            .map((item) => item.name);

        const extra = selectedIngredients
            .filter((item) => !recipeCodes.includes(item.code))
            .map((item) => item.name);

        setMissingIngredients(missing);
        setExtraIngredients(extra);

        const isCorrect = missing.length === 0 && extra.length === 0;

        setResult(isCorrect ? "Correct ✅" : "Incorrect ❌");
    };

    const handleNextRecipe = () => {
        setRecipe(getRandomRecipe());
        setSelectedIngredients([]);
        resetCheckState();
    };

    return (
        <main className="training-page">
            <div className="training-page__header">
                <span className="training-page__label">Make:</span>
                <h1 className="training-page__recipe-name">{recipe.title}</h1>
            </div>

            <section className="training-page__selected">
                {/*<h2 className="training-page__section-title">Selected Items</h2>*/}

                <div className="training-page__selection-tray">
                    {selectedIngredients.length === 0 ? (
                        <div className="training-page__placeholder">
                            <div className="training-page__placeholder-icon">+</div>

                            <div className="training-page__placeholder-content">
                                <p className="training-page__empty">Tap ingredients below</p>

                                <div className="training-page__placeholder-lines">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="training-page__burger-stack">
                            {selectedIngredients.map((ingredient, index) => {
                                const isExtra = extraIngredients.includes(ingredient.name);

                                return (
                                    <div
                                        key={ingredient.code}
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
                                    </div>
                                );
                            })}
                        </div>
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
                        const isSelected = selectedCodes.includes(ingredient.code);

                        return (
                            <button
                                key={ingredient.code}
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

            <div className="training-page__bottom-actions">
                <button
                    type="button"
                    onClick={handleNextRecipe}
                    className="training-page__bottom-button training-page__bottom-button--secondary"
                >
                    Next
                </button>

                <button
                    type="button"
                    onClick={handleDone}
                    className="training-page__bottom-button"
                >
                    DONE
                </button>
            </div>

            {result && <div className="training-page__result">{result}</div>}

            {showAnswer && (
                <section className="training-page__answer">
                    <h2 className="training-page__section-title">Correct Recipe</h2>

                    <div className="training-page__answer-list">
                        {recipe.ingredients.map((ingredient) => (
                            <div key={ingredient.code} className="training-page__answer-item">
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