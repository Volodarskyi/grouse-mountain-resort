export const menuItemStations = [
    "front_desk",
    "grill",
    "kitchen",
    "bar",
    "expo",
] as const;

export type MenuItemStation = (typeof menuItemStations)[number];
