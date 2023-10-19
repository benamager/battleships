import { FunctionComponent, useRef } from "react";
import Ship from "@/components/Ship";
import { ShipProps } from "@/types/Ship";
import Cell from "@/components/Cell";

interface GameGridProps {
    gridData: string[][];
    ships?: ShipProps[];
    setShips?: (ships: ShipProps[]) => void;
}

const ItemTypes = {
    KNIGHT: "knight",
};

// Is our game grid or ocean grid. It's a 2D array of strings.
const GameGrid: FunctionComponent<GameGridProps> = ({ gridData, ships, setShips }) => {
    const gameGridRef = useRef<HTMLDivElement>(null); // clientHeight / 10 = cell width and height

    return (
        <div ref={gameGridRef} className="game-grid">
            {gridData.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <Cell key={rowIndex + columnIndex} x={columnIndex} y={rowIndex} setShips={setShips} />
                    ))}
                </div>
            ))}

            {ships && ships.map((ship) => <Ship key={ship.id} setShips={setShips} {...ship} gameGridRef={gameGridRef} />)}
        </div>
    );
};

export default GameGrid;
