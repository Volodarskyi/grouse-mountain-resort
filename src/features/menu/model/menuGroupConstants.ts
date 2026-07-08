export const menuGroupIcons = [
    "/assets/icons/menu/icon-beer.svg",
    "/assets/icons/menu/icon-burger.svg",
    "/assets/icons/menu/icon-cafe.svg",
    "/assets/icons/menu/icon-cherry.svg",
    "/assets/icons/menu/icon-cocktail.svg",
    "/assets/icons/menu/icon-dessert.svg",
    "/assets/icons/menu/icon-fast-food.svg",
    "/assets/icons/menu/icon-fast-food-set.svg",
    "/assets/icons/menu/icon-french-fries.svg",
    "/assets/icons/menu/icon-gingerbread-man.svg",
    "/assets/icons/menu/icon-hot-dog.svg",
    "/assets/icons/menu/icon-ice-cream-cone.svg",
    "/assets/icons/menu/icon-pizza.svg",
    "/assets/icons/menu/icon-poultry-leg.svg",
    "/assets/icons/menu/icon-salad.svg",
    "/assets/icons/menu/icon-snack.svg",
    "/assets/icons/menu/icon-soda.svg",
    "/assets/icons/menu/icon-soup-plate.svg",
    "/assets/icons/menu/icon-tacos.svg",
    "/assets/icons/menu/icon-wine-bar.svg",
] as const;

export type MenuGroupIcon = (typeof menuGroupIcons)[number];
