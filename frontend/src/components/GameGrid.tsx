import React, { FunctionComponent, useEffect, useState, useContext, createRef } from "react";
import { DraggingContext } from "@/contexts/DraggingContext";
import { ShipProps } from "@/types/Ship";
import Cell from "@/components/Cell";
import Ship from "@/components/Ship";

interface GameGridProps {
    ships?: ShipProps[];
    setShips?: React.Dispatch<React.SetStateAction<ShipProps[]>>;
}

const GameGrid: FunctionComponent<GameGridProps> = ({ ships, setShips }) => {
    const grid = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
    const gameGridRef = createRef<HTMLDivElement>();

    return (
        <div className="game-grid" ref={gameGridRef}>
            {/* Render 2D grid with ships integrated */}
            {grid.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <Cell key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} setShips={setShips} />
                    ))}
                </div>
            ))}

            {/* Render ships */}
            {ships?.map((ship) => <Ship key={ship.id} ship={ship} ships={ships} shipId={ship.id} setShips={setShips} gameGridRef={gameGridRef} />)}
        </div>
    );
};

export default GameGrid;
