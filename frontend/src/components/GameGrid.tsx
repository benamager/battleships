import React, { FunctionComponent, useEffect, useState, useContext } from "react";
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

    const { dragging, setDragging } = useContext(DraggingContext);
    console.log(dragging);

    useEffect(() => {
        const cellWidth = 40;
        const cellHeight = 40;

        const handleMouseMove = (e) => {
            if (!dragging.shipId) return;

            // Calculate the offset in pixels from the initial positions
            const offsetX = e.clientX - dragging.initialX;
            const offsetY = e.clientY - dragging.initialY;

            // Converting pixel offsets to cell offsets
            const movedCellsX = Math.round(offsetX / cellWidth) || 0;
            const movedCellsY = Math.round(offsetY / cellHeight) || 0;

            // If there's been no movement, no need to update
            //if (movedCellsX === 0 && movedCellsY === 0) return;

            // Calculate new positions based on the initial cell positions and the movement
            const newCells = dragging.initialCells.map((cell) => ({
                ...cell,
                x: cell.x + movedCellsX,
                y: cell.y + movedCellsY,
            }));

            // Create a set for quick lookup
            const newCellsSet = new Set(newCells.map((cell) => `${cell.x},${cell.y}`));
            // Compare if every cell in shipCells is present in newCellsSet
            const isSameLocation = dragging.currentCells.every((cell) => newCellsSet.has(`${cell.x},${cell.y}`));
            if (isSameLocation) {
                console.log("Same location, aborting...");
                return;
            }

            // Check if any of the cells are overlapping
            if (newCells.some((cell) => cell.x < 0 || cell.x > 9 || cell.y < 0 || cell.y > 9)) {
                if (!dragging.canPlace) return;

                console.log("Out of bounds, aborting...");
                setDragging((prevState) => ({ ...prevState, canPlace: false }));
                return;
            }

            setShips((prevShips) => {
                return prevShips.map((ship) => {
                    if (ship.id === dragging.shipId) {
                        // Replace the ship's current cells with the new cells
                        return {
                            ...ship,
                            cells: newCells,
                        };
                    }
                    return ship;
                });
            });

            setDragging((prevState) => ({ ...prevState, currentCells: newCells }));
        };

        // Adding global mousedown event listener
        window.addEventListener("mousemove", handleMouseMove);

        // Cleanup the event listeners when the component is unmounted
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [dragging, setDragging, setShips]);

    return (
        <div className="game-grid">
            {/* Render 2D grid with ships integrated */}
            {grid.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((_, columnIndex) => (
                        <Cell key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} setShips={setShips} />
                    ))}
                </div>
            ))}

            {/* Render ships */}
            {ships?.map((ship) => <Ship key={ship.id} ship={ship} shipId={ship.id} setShips={setShips} />)}
        </div>
    );
};

export default GameGrid;
