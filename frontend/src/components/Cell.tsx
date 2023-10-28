import { useEffect } from "react";
import { useDrop } from "react-dnd";
import RussianShipTypes from "@/constants/RussianShipTypes";

interface Position {
    x: number;
    y: number;
}

interface Ship {
    id: string;
    startPos: Position;
    endPos: Position;
    orientation: "horizontal" | "vertical";
    length: number;
    health: number;
}

export default function Cell({ x, y, setShips }) {
    return <div className="game-grid__cell"></div>;
}
