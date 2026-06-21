import Image from "next/image";
import { Carousel } from "antd";

import { Ingredient } from "@/features/training/model/trainingData";

import "./IngredientsSliderSection.Styles.scss";

type IngredientsSliderSectionProps = {
    ingredientSlides: Ingredient[][];
    selectedCodes: string[];
    onIngredientClick: (ingredient: Ingredient) => void;
};

export const IngredientsSliderSection = ({
    ingredientSlides,
    selectedCodes,
    onIngredientClick,
}: IngredientsSliderSectionProps) => {
    return (
        <section className="training-ingredients-slider-section">
            <h2 className="training-ingredients-slider-section__section-title">
                Ingredients
            </h2>

            <Carousel
                dots
                draggable
                infinite={false}
                className="training-ingredients-slider-section__ingredients-carousel"
            >
                {ingredientSlides.map((slide, slideIndex) => (
                    <div
                        key={`ingredient-slide-${slideIndex}`}
                        className="training-ingredients-slider-section__slide"
                    >
                        <div className="training-ingredients-slider-section__grid">
                            {slide.map((ingredient) => {
                                const isSelected = selectedCodes.includes(ingredient.code);

                                return (
                                    <button
                                        key={ingredient.code}
                                        type="button"
                                        onClick={() => onIngredientClick(ingredient)}
                                        className={`training-ingredients-slider-section__ingredient ${
                                            isSelected
                                                ? "training-ingredients-slider-section__ingredient--active"
                                                : ""
                                        }`}
                                    >
                                        <Image
                                            src={ingredient.imgUrl}
                                            alt={ingredient.name}
                                            width={72}
                                            height={72}
                                            className="training-ingredients-slider-section__ingredient-image"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </Carousel>
        </section>
    );
};
