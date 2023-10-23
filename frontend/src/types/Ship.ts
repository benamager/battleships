export type ShipType = "BATTLESHIP" | "CRUISER" | "DESTROYER" | "SUBMARINE";

// A single ship
export interface ShipProps {
    type: ShipType;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    orientation: "vertical" | "horizontal";
    length: number;
    health: number;
}


export interface ShipsProps {
    ships: ShipProps[];
}