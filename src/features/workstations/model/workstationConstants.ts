export const productionAreas = [
    "front_desk",
    "kitchen",
    "bar",
    "expo",
] as const;

export type ProductionArea = (typeof productionAreas)[number];

export const workstationStatuses = ["active", "inactive"] as const;

export type WorkstationStatus = (typeof workstationStatuses)[number];

export const stationProductionAreaMap: Record<string, ProductionArea> = {
    front_desk: "front_desk",
    grill: "kitchen",
    kitchen: "kitchen",
    bar: "bar",
    expo: "expo",
    pizza: "kitchen",
};

export function getProductionAreaForStation(station: string): ProductionArea {
    return stationProductionAreaMap[station] ?? "kitchen";
}
