import "@/app.scss";
import GameGrid from "@/components/GameGrid";
import LabeledGameGrid from "@/layouts/LabeledGameGrid";
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ShipProps } from "@/types/Ship";

const cellWidth = 40;
const cellHeight = 40;

export default function App() {
    const isTouchDevice = () => false;
    const DndBackend = isTouchDevice() ? TouchBackend : HTML5Backend;

    const moveShip = (shipId, movedCellsX, movedCellsY) => {
        console.log("Moving ship:", shipId, movedCellsX, movedCellsY);
        setShips((prevShips) => {
            return prevShips.map((ship) => {
                if (ship.id === shipId) {
                    // New start position
                    const newStartPos = {
                        x: ship.startPos.x + movedCellsX,
                        y: ship.startPos.y + movedCellsY,
                    };

                    // Calculate new end position based on the orientation and length of the ship
                    const newEndPos = {
                        x: ship.orientation === "horizontal" ? newStartPos.x + ship.length - 1 : newStartPos.x,
                        y: ship.orientation === "vertical" ? newStartPos.y + ship.length - 1 : newStartPos.y,
                    };

                    // Returning a new ship object with updated positions
                    return {
                        ...ship,
                        startPos: newStartPos,
                        endPos: newEndPos,
                    };
                }

                // If the ship is not the one being moved, return it as is
                return ship;
            });
        });
    };

    // Placeholder 2D array with empty strings
    const gridData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
    const [ships, setShips] = useState<ShipProps[]>([
        {
            id: "BATTLESHIP",
            startPos: { x: 4, y: 1 },
            endPos: { x: 4, y: 4 },
            orientation: "vertical",
            length: 4,
            health: 4,
            isDragging: false,
        },
    ]);

    useEffect(() => {
        let initialX = null;
        let initialY = null;
        let shipId = null;

        const handleMouseDown = (e) => {
            shipId = e.target.dataset.shipid;
            initialX = e.clientX;
            initialY = e.clientY;

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (e) => {
            if (initialX === null || initialY === null) return;

            // Calculate the offset in pixels from the initial positions
            const offsetX = e.clientX - initialX;
            const offsetY = e.clientY - initialY;

            // Converting pixel offsets to cell offsets
            const movedCellsX = Math.round(offsetX / cellWidth);
            const movedCellsY = Math.round(offsetY / cellHeight);

            console.log("Moving ship:", shipId, movedCellsX, movedCellsY);
            // Only move the ship if there's a noticeable cell offset
            // if (movedCellsX !== 0 || movedCellsY !== 0) {
            //     moveShip(shipId, movedCellsX, movedCellsY);

            //     // Update the initial mouse position after moving the ship
            //     initialX = e.clientX;
            //     initialY = e.clientY;
            // }
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            initialX = null;
            initialY = null;
        };

        // Adding global mousedown event listener
        window.addEventListener("mousedown", handleMouseDown);

        // Cleanup the event listeners when the component is unmounted
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <DndProvider backend={DndBackend}>
            <main className="flex flex-col">
                <h1>Battleship</h1>
                <div className="flex gap-5 mx-auto">
                    <LabeledGameGrid>
                        <GameGrid gridData={gridData} ships={ships} setShips={setShips} />
                    </LabeledGameGrid>
                    <LabeledGameGrid>
                        <GameGrid gridData={gridData} />
                    </LabeledGameGrid>
                </div>
            </main>
        </DndProvider>
    );
}
