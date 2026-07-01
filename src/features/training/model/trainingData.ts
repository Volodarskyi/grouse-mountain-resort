export type Ingredient = {
    code: string;
    name: string;
    imgUrl: string;
};

export type Recipe = {
    title: string;
    ingredients: Ingredient[];
};

export const ingredients: Ingredient[] = [
    {
        code: "ING_GRILLED_BRIOCHE_BUN_TOP",
        name: "Grilled Brioche Bun Top",
        imgUrl: "/assets/ingredients/GrilledBriocheBunTop.png",
    },
    {
        code: "ING_GRILLED_BRIOCHE_BUN_BOTTOM",
        name: "Grilled Brioche Bun Bottom",
        imgUrl: "/assets/ingredients/GrilledBriocheBunBottom.png",
    },
    {
        code: "ING_BEEF_PATTY",
        name: "Beef Patty",
        imgUrl: "/assets/ingredients/BeefPatty.png",
    },
    {
        code: "ING_DOUBLE_BEEF_PATTY",
        name: "Double Beef Patty",
        imgUrl: "/assets/ingredients/DoubleBeefPatty.png",
    },
    {
        code: "ING_AMERICAN_CHEESE_SLICE",
        name: "American Cheese Slice",
        imgUrl: "/assets/ingredients/AmericanCheeseSlice.png",
    },
    {
        code: "ING_CRISPY_BACON",
        name: "Crispy Bacon",
        imgUrl: "/assets/ingredients/CrispyBacon.png",
    },
    {
        code: "ING_FRESH_LETTUCE",
        name: "Fresh Lettuce",
        imgUrl: "/assets/ingredients/FreshLettuce.png",
    },
    {
        code: "ING_PICKLES",
        name: "Pickles",
        imgUrl: "/assets/ingredients/Pickles.png",
    },
    {
        code: "ING_RED_ONION_RINGS",
        name: "Red Onion Rings",
        imgUrl: "/assets/ingredients/RedOnionRings.png",
    },
    {
        code: "ING_GRILLED_ONION",
        name: "Grilled Onion",
        imgUrl: "/assets/ingredients/GrilledOnion.png",
    },
    {
        code: "ING_BANANA_PEPPERS",
        name: "Banana Peppers",
        imgUrl: "/assets/ingredients/BananaPeppers.png",
    },
    {
        code: "ING_PEAK_SAUCE",
        name: "Peak Sauce",
        imgUrl: "/assets/ingredients/PeakSauce.png",
    },
    {
        code: "ING_BBQ_SAUCE",
        name: "BBQ Sauce",
        imgUrl: "/assets/ingredients/BBQSauce.png",
    },
    {
        code: "ING_MAYONNAISE",
        name: "Mayonnaise",
        imgUrl: "/assets/ingredients/Mayonnaise.png",
    },
    {
        code: "ING_BEYOND_MEAT_PATTY",
        name: "Beyond Meat Patty",
        imgUrl: "/assets/ingredients/BeyondMeatPatty.png",
    },
    {
        code: "ING_GRILLED_CHICKEN_BREAST",
        name: "Grilled Chicken Breast",
        imgUrl: "/assets/ingredients/GrilledChickenBreast.png",
    },
    {
        code: "ING_HOT_DOG_BUN",
        name: "Hot Dog Bun",
        imgUrl: "/assets/ingredients/HotDogBun.png",
    },
    {
        code: "ING_ALL_BEEF_DOG",
        name: "All Beef Dog",
        imgUrl: "/assets/ingredients/AllBeefDog.png",
    },
    {
        code: "ING_BRATWURST_SAUSAGE",
        name: "Bratwurst Sausage",
        imgUrl: "/assets/ingredients/BratwurstSausage.png",
    },
    {
        code: "ING_SAUERKRAUT",
        name: "Sauerkraut",
        imgUrl: "/assets/ingredients/Sauerkraut.png",
    },
    {
        code: "ING_CRISPY_ONION",
        name: "Crispy Onion",
        imgUrl: "/assets/ingredients/CrispyOnion.png",
    },
    {
        code: "ING_CRUSHED_POTATO_CHIPS",
        name: "Crushed Potato Chips",
        imgUrl: "/assets/ingredients/CrushedPotatoChips.png",
    },
    {
        code: "ING_BEER_MUSTARD",
        name: "Beer Mustard",
        imgUrl: "/assets/ingredients/BeerMustard.png",
    },
    {
        code: "ING_KETCHUP",
        name: "Ketchup",
        imgUrl: "/assets/ingredients/Ketchup.png",
    },
    {
        code: "ING_ROMAINE_LETTUCE",
        name: "Romaine Lettuce",
        imgUrl: "/assets/ingredients/RomaineLettuce.png",
    },
    {
        code: "ING_TOMATO",
        name: "Tomato",
        imgUrl: "/assets/ingredients/Tomato.png",
    },
    {
        code: "ING_SWEET_CORN",
        name: "Sweet Corn",
        imgUrl: "/assets/ingredients/SweetCorn.png",
    },
    {
        code: "ING_BLACK_BEANS",
        name: "Black Beans",
        imgUrl: "/assets/ingredients/BlackBeans.png",
    },
    {
        code: "ING_PARMESAN_CHEESE",
        name: "Parmesan Cheese",
        imgUrl: "/assets/ingredients/ParmesanCheese.png",
    },
    {
        code: "ING_CROUTONS",
        name: "Croutons",
        imgUrl: "/assets/ingredients/Croutons.png",
    },
    {
        code: "ING_CHIPOTLE_LIME_DRESSING",
        name: "Chipotle-Lime Dressing",
        imgUrl: "/assets/ingredients/ChipotleLimeDressing.png",
    },
    {
        code: "ING_CAESAR_DRESSING",
        name: "Caesar Dressing",
        imgUrl: "/assets/ingredients/CaesarDressing.png",
    },
];

const getIngredient = (code: string): Ingredient => {
    const ingredient = ingredients.find((item) => item.code === code);

    if (!ingredient) {
        throw new Error(`Ingredient not found: ${code}`);
    }

    return ingredient;
};

export const ingredientSlideOrderByMenu = {
    RustyRail: [
        "ING_GRILLED_BRIOCHE_BUN_TOP",
        "ING_GRILLED_BRIOCHE_BUN_BOTTOM",
        "ING_HOT_DOG_BUN",
        "ING_BEYOND_MEAT_PATTY",
        "ING_BEEF_PATTY",
        "ING_DOUBLE_BEEF_PATTY",
        "ING_ALL_BEEF_DOG",
        "ING_BRATWURST_SAUSAGE",
        "ING_GRILLED_CHICKEN_BREAST",
        "ING_AMERICAN_CHEESE_SLICE",
        "ING_PARMESAN_CHEESE",
        "ING_PICKLES",
        "ING_CRISPY_BACON",
        "ING_FRESH_LETTUCE",
        "ING_RED_ONION_RINGS",
        "ING_GRILLED_ONION",
        "ING_BANANA_PEPPERS",
        "ING_SAUERKRAUT",
        "ING_CRISPY_ONION",
        "ING_CRUSHED_POTATO_CHIPS",
        "ING_ROMAINE_LETTUCE",
        "ING_TOMATO",
        "ING_SWEET_CORN",
        "ING_BLACK_BEANS",
        "ING_CROUTONS",
        "ING_PEAK_SAUCE",
        "ING_BBQ_SAUCE",
        "ING_MAYONNAISE",
        "ING_CHIPOTLE_LIME_DRESSING",
        "ING_CAESAR_DRESSING",
        "ING_BEER_MUSTARD",
        "ING_KETCHUP",
    ],
    chicken: [
        "ING_GRILLED_CHICKEN_BREAST",
        "ING_FRESH_LETTUCE",
        "ING_PICKLES",
        "ING_RED_ONION_RINGS",
        "ING_MAYONNAISE",
        "ING_BBQ_SAUCE",
        "ING_GRILLED_BRIOCHE_BUN_TOP",
        "ING_GRILLED_BRIOCHE_BUN_BOTTOM",
    ],
} as const;

export const getIngredientsByCodes = (codes: readonly string[]): Ingredient[] => {
    return codes.map(getIngredient);
};

export const recipes: Recipe[] = [
    {
        title: "Single Track Smash",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEEF_PATTY"),
            getIngredient("ING_AMERICAN_CHEESE_SLICE"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "Double Black Diamond",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_DOUBLE_BEEF_PATTY"),
            getIngredient("ING_AMERICAN_CHEESE_SLICE"),
            getIngredient("ING_RED_ONION_RINGS"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "The Ridge Runner",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEEF_PATTY"),
            getIngredient("ING_AMERICAN_CHEESE_SLICE"),
            getIngredient("ING_BANANA_PEPPERS"),
            getIngredient("ING_GRILLED_ONION"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_BBQ_SAUCE"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "The Full Send",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEEF_PATTY"),
            getIngredient("ING_CRISPY_BACON"),
            getIngredient("ING_AMERICAN_CHEESE_SLICE"),
            getIngredient("ING_GRILLED_ONION"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "The First Ride",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEEF_PATTY"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "The Switchback",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEYOND_MEAT_PATTY"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_RED_ONION_RINGS"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "BBQ Chicken Burger",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_GRILLED_CHICKEN_BREAST"),
            getIngredient("ING_FRESH_LETTUCE"),
            getIngredient("ING_RED_ONION_RINGS"),
            getIngredient("ING_PICKLES"),
            getIngredient("ING_MAYONNAISE"),
            getIngredient("ING_BBQ_SAUCE"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
    {
        title: "The Grouse Grind Dog",
        ingredients: [
            getIngredient("ING_HOT_DOG_BUN"),
            getIngredient("ING_ALL_BEEF_DOG"),
            getIngredient("ING_BANANA_PEPPERS"),
            getIngredient("ING_PEAK_SAUCE"),
            getIngredient("ING_CRUSHED_POTATO_CHIPS"),
        ],
    },
    {
        title: "Bratwurst Bun",
        ingredients: [
            getIngredient("ING_HOT_DOG_BUN"),
            getIngredient("ING_BRATWURST_SAUSAGE"),
            getIngredient("ING_SAUERKRAUT"),
            getIngredient("ING_BEER_MUSTARD"),
            getIngredient("ING_CRISPY_ONION"),
        ],
    },
    {
        title: "The Peak Chicken Salad",
        ingredients: [
            getIngredient("ING_GRILLED_CHICKEN_BREAST"),
            getIngredient("ING_ROMAINE_LETTUCE"),
            getIngredient("ING_TOMATO"),
            getIngredient("ING_SWEET_CORN"),
            getIngredient("ING_BLACK_BEANS"),
            getIngredient("ING_RED_ONION_RINGS"),
            getIngredient("ING_CHIPOTLE_LIME_DRESSING"),
        ],
    },
    {
        title: "Kids Hot Dog",
        ingredients: [
            getIngredient("ING_HOT_DOG_BUN"),
            getIngredient("ING_ALL_BEEF_DOG"),
        ],
    },
    {
        title: "Kids Smash Burger",
        ingredients: [
            getIngredient("ING_GRILLED_BRIOCHE_BUN_BOTTOM"),
            getIngredient("ING_BEEF_PATTY"),
            getIngredient("ING_AMERICAN_CHEESE_SLICE"),
            getIngredient("ING_KETCHUP"),
            getIngredient("ING_GRILLED_BRIOCHE_BUN_TOP"),
        ],
    },
];
