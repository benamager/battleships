// A single ship
export interface SingleShipProps {
    id: string;
    cells: {
        x: number;
        y: number;
    }[];
    health: number;
}


export interface MultipleShipsProps {
    ships: SingleShipProps[];
}