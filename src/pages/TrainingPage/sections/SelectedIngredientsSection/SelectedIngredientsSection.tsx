import Image from "next/image";

import { Ingredient } from "@/features/training/model/trainingData";

import "./SelectedIngredientsSection.Styles.scss";

type SelectedIngredientsSectionProps = {
    selectedIngredients: Ingredient[];
    missingIngredients: string[];
    extraIngredients: string[];
    result: string;
    showAnswer: boolean;
    recipeIngredients: Ingredient[];
    variant?: "page" | "modal";
};

export const SelectedIngredientsSection = ({
    selectedIngredients,
    missingIngredients,
    extraIngredients,
    result,
    showAnswer,
    recipeIngredients,
    variant = "page",
}: SelectedIngredientsSectionProps) => {
    if (variant === "modal") {
        return (
            <section className="training-selected-section training-selected-section--modal">
                <div className="training-selected-section__check-list">
                    {selectedIngredients.map((ingredient) => {
                        const isExtra = extraIngredients.includes(ingredient.name);

                        return (
                            <div
                                key={ingredient.code}
                                className={`training-selected-section__check-item ${
                                    isExtra
                                        ? "training-selected-section__check-item--wrong"
                                        : ""
                                }`}
                            >
                                <Image
                                    src={ingredient.imgUrl}
                                    alt={ingredient.name}
                                    width={44}
                                    height={44}
                                    className="training-selected-section__check-image"
                                />

                                <span>{ingredient.name}</span>
                            </div>
                        );
                    })}

                    {recipeIngredients.map((ingredient) => (
                        <div
                            key={`missing-${ingredient.code}`}
                            className="training-selected-section__check-item training-selected-section__check-item--missing"
                        >
                            <Image
                                src={ingredient.imgUrl}
                                alt={ingredient.name}
                                width={44}
                                height={44}
                                className="training-selected-section__check-image"
                            />

                            <span>{ingredient.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="training-selected-section">
            <div className="training-selected-section__selected">
                <div className="training-selected-section__selection-tray">
                    {selectedIngredients.length === 0 ? (
                        <div className="training-selected-section__placeholder">
                            <div className="training-selected-section__placeholder-icon">+</div>

                            <div className="training-selected-section__placeholder-content">
                                <p className="training-selected-section__empty">
                                    Tap ingredients below
                                </p>

                                <div className="training-selected-section__placeholder-lines">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="training-selected-section__burger-stack">
                            {selectedIngredients.map((ingredient, index) => {
                                const isExtra = extraIngredients.includes(ingredient.name);

                                return (
                                    <div
                                        key={ingredient.code}
                                        className={`training-selected-section__selected-layer ${
                                            isExtra
                                                ? "training-selected-section__selected-layer--wrong"
                                                : ""
                                        }`}
                                        style={{ zIndex: selectedIngredients.length - index }}
                                    >
                                        <Image
                                            src={ingredient.imgUrl}
                                            alt={ingredient.name}
                                            width={44}
                                            height={44}
                                            className="training-selected-section__selected-image"
                                        />

                                        <span>{ingredient.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {missingIngredients.length > 0 && (
                    <div className="training-selected-section__missing">
                        <h3 className="training-selected-section__feedback-title">
                            Missing Ingredients
                        </h3>

                        <div className="training-selected-section__missing-list">
                            {missingIngredients.map((name) => (
                                <div
                                    key={name}
                                    className="training-selected-section__missing-item"
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {result && <div className="training-selected-section__result">{result}</div>}

            {showAnswer && (
                <section className="training-selected-section__answer">
                    <h2 className="training-selected-section__section-title">
                        Correct Recipe
                    </h2>

                    <div className="training-selected-section__answer-list">
                        {recipeIngredients.map((ingredient) => (
                            <div
                                key={ingredient.code}
                                className="training-selected-section__answer-item"
                            >
                                <Image
                                    src={ingredient.imgUrl}
                                    alt={ingredient.name}
                                    width={44}
                                    height={44}
                                    className="training-selected-section__answer-image"
                                />

                                <span>{ingredient.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </section>
    );
};
