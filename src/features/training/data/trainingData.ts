export type Ingredient = {
    name: string;
    imgUrl: string;
};

export type Recipe = {
    title: string;
    ingredients: Ingredient[];
};

export const ingredients: Ingredient[] = [
    {
        name: "Grilled Brioche Bun Top",
        imgUrl: "/assets/ingredients/GrilledBriocheBunTop.png",
    },
    {
        name: "Grilled Brioche Bun Bottom",
        imgUrl: "/assets/ingredients/GrilledBriocheBunBottom.png",
    },
    {
        name: "Beef Patty",
        imgUrl: "/assets/ingredients/BeefPatty.png",
    },
    {
        name: "American Cheese Slice",
        imgUrl: "/assets/ingredients/AmericanCheeseSlice.png",
    },
    {
        name: "Crispy Bacon",
        imgUrl: "/assets/ingredients/CrispyBacon.png",
    },
    {
        name: "Fresh Lettuce",
        imgUrl: "/assets/ingredients/FreshLettuce.png",
    },
    {
        name: "Pickles",
        imgUrl: "/assets/ingredients/Pickles.png",
    },
    {
        name: "Red Onion Rings",
        imgUrl: "/assets/ingredients/RedOnionRings.png",
    },
    {
        name: "Grilled Onion",
        imgUrl: "/assets/ingredients/GrilledOnion.png",
    },
    {
        name: "Banana Peppers",
        imgUrl: "/assets/ingredients/BananaPeppers.png",
    },
    {
        name: "Peak Sauce",
        imgUrl: "/assets/ingredients/PeakSauce.png",
    },
    {
        name: "BBQ Sauce",
        imgUrl: "/assets/ingredients/BBQSauce.png",
    },
    {
        name: "Mayonnaise",
        imgUrl: "/assets/ingredients/Mayonnaise.png",
    },
    {
        name: "Beyond Meat Patty",
        imgUrl: "/assets/ingredients/BeyondMeatPatty.png",
    },
    {
        name: "Grilled Chicken Breast",
        imgUrl: "/assets/ingredients/GrilledChickenBreast.png",
    },
];

const getIngredient = (name: string): Ingredient => {
    const ingredient = ingredients.find((item) => item.name === name);

    if (!ingredient) {
        throw new Error(`Ingredient not found: ${name}`);
    }

    return ingredient;
};

export const recipes: Recipe[] = [
    {
        title: "Single Track Smash",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beef Patty"),
            getIngredient("American Cheese Slice"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Pickles"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "Double Black Diamond",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beef Patty"),
            getIngredient("Beef Patty"),
            getIngredient("American Cheese Slice"),
            getIngredient("Red Onion Rings"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Pickles"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "The Ridge Runner",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beef Patty"),
            getIngredient("American Cheese Slice"),
            getIngredient("Banana Peppers"),
            getIngredient("Grilled Onion"),
            getIngredient("Fresh Lettuce"),
            getIngredient("BBQ Sauce"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "The Full Send",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beef Patty"),
            getIngredient("Crispy Bacon"),
            getIngredient("American Cheese Slice"),
            getIngredient("Grilled Onion"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Pickles"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "The First Ride",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beef Patty"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Pickles"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "The Switchback",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Beyond Meat Patty"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Red Onion Rings"),
            getIngredient("Pickles"),
            getIngredient("Peak Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
    {
        title: "BBQ Chicken Burger",
        ingredients: [
            getIngredient("Grilled Brioche Bun Top"),
            getIngredient("Grilled Chicken Breast"),
            getIngredient("Fresh Lettuce"),
            getIngredient("Red Onion Rings"),
            getIngredient("Pickles"),
            getIngredient("Mayonnaise"),
            getIngredient("BBQ Sauce"),
            getIngredient("Grilled Brioche Bun Bottom"),
        ],
    },
];