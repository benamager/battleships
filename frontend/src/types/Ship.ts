// A single ship
export interface ShipProps {
    id: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    orientation: "vertical" | "horizontal";
    health: 4;
}

export interface ShipsProps {
    ships: ShipProps[];
}
