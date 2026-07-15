"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { MenuItemDetailModalProps } from "@/store/reducers/modalStore";

export default function MenuItemDetail({
    addOnIngredients,
    calories,
    description,
    imageUrl,
    includedIngredients,
    initialCustomization,
    isModifiable,
    name,
    onCustomizationChange,
    price,
}: MenuItemDetailModalProps) {
    const initialIncludedCounts = useMemo(
        () =>
            Object.fromEntries(
                includedIngredients.map((ingredient) => [ingredient.code, 1]),
            ),
        [includedIngredients],
    );
    const initialAddOnCounts = useMemo(
        () =>
            Object.fromEntries(
                addOnIngredients.map((ingredient) => [ingredient.code, 0]),
            ),
        [addOnIngredients],
    );
    const [includedIngredientCounts, setIncludedIngredientCounts] =
        useState<Record<string, number>>(
            initialCustomization?.includedIngredientCounts ?? initialIncludedCounts,
        );
    const [addOnIngredientCounts, setAddOnIngredientCounts] =
        useState<Record<string, number>>(
            initialCustomization?.addOnIngredientCounts ?? initialAddOnCounts,
        );
    const [quantity, setQuantity] = useState(
        initialCustomization?.quantity ?? 1,
    );
    const [isModificationsOpen, setIsModificationsOpen] = useState(
        Boolean(initialCustomization),
    );
    const [isAddOnsOpen, setIsAddOnsOpen] = useState(
        Boolean(initialCustomization),
    );

    useEffect(() => {
        onCustomizationChange?.({
            addOnIngredientCounts,
            includedIngredientCounts,
            quantity,
        });
    }, [
        addOnIngredientCounts,
        includedIngredientCounts,
        onCustomizationChange,
        quantity,
    ]);

    function updateIncludedIngredientCount(ingredientCode: string, delta: number) {
        setIncludedIngredientCounts((currentCounts) => ({
            ...currentCounts,
            [ingredientCode]: Math.max(
                0,
                (currentCounts[ingredientCode] ?? 1) + delta,
            ),
        }));
    }

    function updateAddOnIngredientCount(ingredientCode: string, delta: number) {
        setAddOnIngredientCounts((currentCounts) => ({
            ...currentCounts,
            [ingredientCode]: Math.max(
                0,
                (currentCounts[ingredientCode] ?? 0) + delta,
            ),
        }));
    }

    function getIngredientStateClass({
        baseCount,
        count,
    }: {
        baseCount: number;
        count: number;
    }) {
        if (count < baseCount) {
            return "menu-item-detail-modal__modifier--removed";
        }

        if (count > baseCount) {
            return "menu-item-detail-modal__modifier--added";
        }

        return "";
    }

    const hasModifications =
        isModifiable &&
        (includedIngredients.length > 0 || addOnIngredients.length > 0);

    return (
        <div className="app-modal-body menu-item-detail-modal">
            <div className="menu-item-detail-modal__image">
                {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill sizes="220px" />
                ) : (
                    <span>No image</span>
                )}
            </div>

            {description ? (
                <p className="app-modal-body__text">{description}</p>
            ) : null}

            <p className="app-modal-body__text">
                ${price.toFixed(2)} / cal: {calories}
            </p>

            {hasModifications ? (
                <div className="menu-item-detail-modal__modifiers">
                    {includedIngredients.length > 0 ? (
                        <section className="menu-item-detail-modal__section">
                            <button
                                type="button"
                                className="menu-item-detail-modal__section-toggle"
                                aria-expanded={isModificationsOpen}
                                onClick={() =>
                                    setIsModificationsOpen(
                                        (currentValue) => !currentValue,
                                    )
                                }
                            >
                                <span>Modifications</span>
                                <span className="menu-item-detail-modal__section-arrow">
                                    {isModificationsOpen ? "↑" : "↓"}
                                </span>
                            </button>
                            {isModificationsOpen ? (
                                <div className="menu-item-detail-modal__list">
                                    {includedIngredients.map((ingredient) => {
                                        const count =
                                            includedIngredientCounts[
                                                ingredient.code
                                            ] ?? 1;
                                        const stateClass = getIngredientStateClass({
                                            baseCount: 1,
                                            count,
                                        });

                                        return (
                                            <div
                                                key={ingredient.code}
                                                className={[
                                                    "menu-item-detail-modal__modifier",
                                                    stateClass,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            >
                                                <span className="menu-item-detail-modal__modifier-image">
                                                    <Image
                                                        src={ingredient.imgUrl}
                                                        alt=""
                                                        width={44}
                                                        height={44}
                                                    />
                                                </span>
                                                <span className="menu-item-detail-modal__modifier-name">
                                                    {ingredient.name}
                                                </span>
                                                <div className="menu-item-detail-modal__counter">
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${ingredient.name}`}
                                                        onClick={() =>
                                                            updateIncludedIngredientCount(
                                                                ingredient.code,
                                                                -1,
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span>{count}</span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Add ${ingredient.name}`}
                                                        onClick={() =>
                                                            updateIncludedIngredientCount(
                                                                ingredient.code,
                                                                1,
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </section>
                    ) : null}

                    {addOnIngredients.length > 0 ? (
                        <section className="menu-item-detail-modal__section">
                            <button
                                type="button"
                                className="menu-item-detail-modal__section-toggle"
                                aria-expanded={isAddOnsOpen}
                                onClick={() =>
                                    setIsAddOnsOpen((currentValue) => !currentValue)
                                }
                            >
                                <span>Add-ons</span>
                                <span className="menu-item-detail-modal__section-arrow">
                                    {isAddOnsOpen ? "↑" : "↓"}
                                </span>
                            </button>
                            {isAddOnsOpen ? (
                                <div className="menu-item-detail-modal__list">
                                    {addOnIngredients.map((ingredient) => {
                                        const count =
                                            addOnIngredientCounts[
                                                ingredient.code
                                            ] ?? 0;
                                        const stateClass = getIngredientStateClass({
                                            baseCount: 0,
                                            count,
                                        });

                                        return (
                                            <div
                                                key={ingredient.code}
                                                className={[
                                                    "menu-item-detail-modal__modifier",
                                                    stateClass,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            >
                                                <span className="menu-item-detail-modal__modifier-image">
                                                    <Image
                                                        src={ingredient.imgUrl}
                                                        alt=""
                                                        width={44}
                                                        height={44}
                                                    />
                                                </span>
                                                <span className="menu-item-detail-modal__modifier-name">
                                                    {ingredient.name}
                                                </span>
                                                <div className="menu-item-detail-modal__counter">
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${ingredient.name}`}
                                                        disabled={count === 0}
                                                        onClick={() =>
                                                            updateAddOnIngredientCount(
                                                                ingredient.code,
                                                                -1,
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span>{count}</span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Add ${ingredient.name}`}
                                                        onClick={() =>
                                                            updateAddOnIngredientCount(
                                                                ingredient.code,
                                                                1,
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </section>
                    ) : null}
                </div>
            ) : null}

            <div className="menu-item-detail-modal__quantity-stepper">
                <button
                    type="button"
                    aria-label={`Remove ${name} from order`}
                    disabled={quantity === 1}
                    onClick={() =>
                        setQuantity((currentQuantity) =>
                            Math.max(1, currentQuantity - 1),
                        )
                    }
                >
                    <span>-</span>
                </button>
                <strong>{quantity}</strong>
                <button
                    type="button"
                    aria-label={`Add ${name} to order`}
                    onClick={() =>
                        setQuantity((currentQuantity) => currentQuantity + 1)
                    }
                >
                    <span>+</span>
                </button>
            </div>
        </div>
    );
}
