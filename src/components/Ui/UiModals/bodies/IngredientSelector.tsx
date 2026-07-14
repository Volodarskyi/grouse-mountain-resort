"use client";

import { Checkbox } from "antd";
import Image from "next/image";
import { useState } from "react";

import type { IngredientSelectorModalProps } from "@/store/reducers/modalStore";

export default function IngredientSelector({
    ingredients,
    onSelectionChange,
    selectedCodes,
}: IngredientSelectorModalProps) {
    const [currentSelectedCodes, setCurrentSelectedCodes] =
        useState<string[]>(selectedCodes);

    function handleToggle(ingredientCode: string, isChecked: boolean) {
        const nextSelectedCodes = isChecked
            ? [...currentSelectedCodes, ingredientCode]
            : currentSelectedCodes.filter((code) => code !== ingredientCode);

        setCurrentSelectedCodes(nextSelectedCodes);
        onSelectionChange(nextSelectedCodes);
    }

    return (
        <div className="app-modal-body ingredient-selector-modal">
            <div className="ingredient-selector-modal__list">
                {ingredients.map((ingredient) => (
                    <label
                        key={ingredient.code}
                        className="ingredient-selector-modal__item"
                    >
                        <Checkbox
                            checked={currentSelectedCodes.includes(ingredient.code)}
                            onChange={(event) =>
                                handleToggle(
                                    ingredient.code,
                                    event.target.checked,
                                )
                            }
                        />
                        <span className="ingredient-selector-modal__image">
                            <Image
                                src={ingredient.imgUrl}
                                alt=""
                                fill
                                sizes="40px"
                            />
                        </span>
                        <span className="ingredient-selector-modal__name">
                            {ingredient.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
