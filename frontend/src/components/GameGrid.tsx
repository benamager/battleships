import { FunctionComponent, useRef, Dispatch, SetStateAction, useEffect } from "react";
import Ship from "@/components/Ship";
import { ShipProps } from "@/types/Ship";
import Cell from "@/components/Cell";

interface GameGridProps {
    gridData: string[][];
    ships?: ShipProps[];
    setShips?: Dispatch<SetStateAction<ShipProps[]>>;
}

// Is our game grid (ocean), which is a 2D array of strings.
// Ships are rendered on top of the grid with position absolute.
const GameGrid: FunctionComponent<GameGridProps> = ({ gridData, ships, setShips }) => {
    const gameGridRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={gameGridRef} className="game-grid">
            {/* Render 2D grid */}
            {gridData.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <Cell key={rowIndex + columnIndex} x={columnIndex} y={rowIndex} setShips={setShips} />
                    ))}
                </div>
            ))}

            {/* Render ships */}
            {ships && ships.map((ship) => <Ship key={ship.id} {...ship} />)}
        </div>
    );
};

export default GameGrid;
