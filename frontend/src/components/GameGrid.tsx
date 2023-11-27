import React, { FunctionComponent, useEffect, useState, useContext, createRef } from "react";
import { DraggingContext } from "@/contexts/DraggingContext";
import { ShipProps } from "@/types/Ship";
import Cell from "@/components/Cell";
import Ship from "@/components/Ship";

interface GameGridProps {
    ships?: ShipProps[];
    setShips?: React.Dispatch<React.SetStateAction<ShipProps[]>>;
}

const GameGrid: FunctionComponent<GameGridProps> = ({ ships, setShips, grid }) => {
    const gameGridRef = createRef<HTMLDivElement>();

    return (
        <div className="game-grid" ref={gameGridRef}>
            {/* Render 2D grid with ships integrated */}
            {grid.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((cellValue, columnIndex) => (
                        <Cell key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} setShips={setShips} cellValue={cellValue} grid={grid} />
                    ))}
                </div>
            ))}

            {/* Render ships */}
            {ships?.map((ship) => <Ship key={ship.id} ship={ship} ships={ships} shipId={ship.id} setShips={setShips} gameGridRef={gameGridRef} currentMap={grid} />)}
        </div>
    );
};

export default GameGrid;
