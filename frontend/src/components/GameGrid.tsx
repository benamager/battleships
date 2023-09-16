import { FunctionComponent } from "react";
import Ship from "./Ship";

interface GameGridProps {
    gridData: string[][];
    ships?: {
        id: number;
        position: { x: number; y: number };
        direction: "horizontal" | "vertical";
        length: number;
    }[];
}

// Is our game grid or ocean grid. It's a 2D array of strings.
const GameGrid: FunctionComponent<GameGridProps> = ({ gridData, ships }) => {
    return (
        <div className="game-grid">
            {gridData.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <div className="game-grid__cell" key={columnIndex}></div>
                    ))}
                </div>
            ))}

            {ships ? ships.map((ship) => <Ship key={ship.id} direction={ship.direction} length={ship.length} position={ship.position} />) : null}
        </div>
    );
};

export default GameGrid;
