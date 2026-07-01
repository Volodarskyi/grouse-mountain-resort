"use client";

import { Modal } from "antd";
import { useMemo, useState } from "react";

import {
    Ingredient,
    Recipe,
    getIngredientsByCodes,
    ingredientSlideOrderByMenu,
    recipes,
} from "@/features/training/model/trainingData";
import {
    chunkIngredients,
    getRandomRecipe,
} from "@/features/training/lib/trainingRecipe";

import { BottomActionsSection } from "./sections/BottomActionsSection/BottomActionsSection";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { IngredientsSliderSection } from "./sections/IngredientsSliderSection/IngredientsSliderSection";
import { SelectedIngredientsSection } from "./sections/SelectedIngredientsSection/SelectedIngredientsSection";

import "./TrainingPage.Styles.scss";

const INGREDIENTS_PER_SLIDE = 8;

export const TrainingPage = () => {
    const [recipe, setRecipe] = useState<Recipe>(recipes[0]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [result, setResult] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
    const [extraIngredients, setExtraIngredients] = useState<string[]>([]);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

    const currentMenu = "RustyRail";

    const ingredientSlides = useMemo(() => {
        const orderedIngredients = getIngredientsByCodes(
            ingredientSlideOrderByMenu[currentMenu],
        );

        return chunkIngredients(orderedIngredients, INGREDIENTS_PER_SLIDE);
    }, []);

    const selectedCodes = useMemo(
        () => selectedIngredients.map((item) => item.code),
        [selectedIngredients],
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
        setResult(missing.length === 0 && extra.length === 0 ? "Correct" : "Incorrect");
        setIsCheckModalOpen(true);
    };

    const handleNextRecipe = () => {
        setRecipe(getRandomRecipe());
        setSelectedIngredients([]);
        setIsCheckModalOpen(false);
        resetCheckState();
    };

    const modalMissingIngredients = recipe.ingredients.filter((ingredient) =>
        missingIngredients.includes(ingredient.name),
    );

    return (
        <main className="training-page">
            <HeaderSection recipeTitle={recipe.title} />

            <SelectedIngredientsSection
                selectedIngredients={selectedIngredients}
                missingIngredients={missingIngredients}
                extraIngredients={extraIngredients}
                result={result}
                showAnswer={showAnswer}
                recipeIngredients={recipe.ingredients}
            />

            <div className="training-page__fixed-panel">
                <IngredientsSliderSection
                    ingredientSlides={ingredientSlides}
                    selectedCodes={selectedCodes}
                    onIngredientClick={handleIngredientClick}
                />

                <BottomActionsSection
                    onNextRecipe={handleNextRecipe}
                    onDone={handleDone}
                />
            </div>

            <Modal
                open={isCheckModalOpen}
                title={
                    <div className="training-page__modal-title">
                        <span className="training-page__modal-label">Check:</span>
                        <span className="training-page__modal-recipe-name">{recipe.title}</span>
                    </div>
                }
                footer={null}
                closable={false}
                keyboard={false}
                mask={{ closable: false }}
                centered
                width={420}
                className="training-page__check-modal"
            >
                <SelectedIngredientsSection
                    selectedIngredients={selectedIngredients}
                    missingIngredients={missingIngredients}
                    extraIngredients={extraIngredients}
                    result=""
                    showAnswer={false}
                    recipeIngredients={modalMissingIngredients}
                    variant="modal"
                />

                <button
                    type="button"
                    onClick={handleNextRecipe}
                    className="training-page__modal-next-button"
                >
                    Next
                </button>
            </Modal>
        </main>
    );
};
