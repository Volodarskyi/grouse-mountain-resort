export const menuItemStations = [
    "front_desk",
    "grill",
    "kitchen",
    "bar",
    "expo",
    "pizza",
] as const;

export type MenuItemStation = (typeof menuItemStations)[number];
