import React from "react";

interface GameGridProps {
    gridData: string[][];
}

// Is our game grid or ocean grid. It's a 2D array of strings.
const GameGrid: React.FC<GameGridProps> = ({ gridData }) => {
    return (
        <div className="game-grid">
            {gridData.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <div className="game-grid__cell" key={columnIndex}></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameGrid;
