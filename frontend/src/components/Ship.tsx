import React, { useContext, useEffect } from "react";
import { DraggingContext } from "@/contexts/DraggingContext";

const Ship = ({ shipId, setShips, ship }) => {
    // Calculate the top and left positions based on the smallest x and y values.
    const topPosition = Math.min(...ship.cells.map((cell) => cell.y)) * 40;
    const leftPosition = Math.min(...ship.cells.map((cell) => cell.x)) * 40;

    // Calculate the width and height based on the range of x and y values.
    const shipWidth = (Math.max(...ship.cells.map((cell) => cell.x)) - Math.min(...ship.cells.map((cell) => cell.x)) + 1) * 40;
    const shipHeight = (Math.max(...ship.cells.map((cell) => cell.y)) - Math.min(...ship.cells.map((cell) => cell.y)) + 1) * 40;

    // Function to check if a neighboring cell exists in the ship
    const hasNeighbor = (cell, direction) => {
        if (direction === "left") {
            return ship.cells.some((c) => c.x === cell.x - 1 && c.y === cell.y);
        } else if (direction === "right") {
            return ship.cells.some((c) => c.x === cell.x + 1 && c.y === cell.y);
        } else if (direction === "top") {
            return ship.cells.some((c) => c.x === cell.x && c.y === cell.y - 1);
        } else if (direction === "bottom") {
            return ship.cells.some((c) => c.x === cell.x && c.y === cell.y + 1);
        }
        return false;
    };

    const { dragging, setDragging } = useContext(DraggingContext);

    // On mouse down set dragging state
    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setDragging({
            shipId: shipId,
            initialX: e.clientX,
            initialY: e.clientY,
            initialCells: ship.cells,
            currentCells: ship.cells,
            canPlace: true,
        });

        // Adding the mouseup event listener here is fine,
        // but we need to ensure that it's removed properly after the mouse is up
        window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseUp() {
        setDragging({
            shipId: null,
            initialX: null,
            initialY: null,
            initialCells: null,
            currentCells: null,
            canPlace: null,
        });

        window.removeEventListener("mouseup", handleMouseUp);
    }

    // Use useEffect to manage event listeners
    useEffect(() => {
        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div
            className="game-grid__ship"
            style={{
                position: "absolute",
                top: `${topPosition}px`,
                left: `${leftPosition}px`,
                width: `${shipWidth}px`,
                height: `${shipHeight}px`,
                pointerEvents: "none",
            }}
        >
            {ship.cells.map((cell, index) => {
                const borderColor = dragging.shipId == ship.id ? "green" : "#0022ff";

                // Determine which borders to apply based on neighboring cells
                const borderTop = hasNeighbor(cell, "top") ? "none" : `2px solid ${borderColor}`;
                const borderBottom = hasNeighbor(cell, "bottom") ? "none" : `2px solid ${borderColor}`;
                const borderLeft = hasNeighbor(cell, "left") ? "none" : `2px solid ${borderColor}`;
                const borderRight = hasNeighbor(cell, "right") ? "none" : `2px solid ${borderColor}`;

                return (
                    <div
                        onMouseDown={handleMouseDown}
                        key={index}
                        className="game-grid__ship-cell"
                        style={{
                            width: "40px",
                            height: "40px",
                            position: "absolute",
                            left: `${(cell.x - Math.min(...ship.cells.map((c) => c.x))) * 40}px`,
                            top: `${(cell.y - Math.min(...ship.cells.map((c) => c.y))) * 40}px`,
                            borderTop,
                            borderBottom,
                            borderLeft,
                            borderRight,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Ship;

// import React, { useContext, useEffect } from "react";
// import { DraggingContext } from "@/contexts/DraggingContext";

// export default function Ship({ x, y, shipId, setShips }) {
//     const { dragging, setDragging } = useContext(DraggingContext);

//     console.log(shipId, "HEJ");

//     function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
//         setDragging({
//             shipId: shipId,
//             initialX: e.clientX,
//             initialY: e.clientY,
//             initialCells: [
//                 { x: 2, y: 2 },
//                 { x: 2, y: 3 },
//                 { x: 2, y: 4 },
//                 { x: 3, y: 3 },
//                 { x: 1, y: 3 },
//             ],
//         });

//         // Adding the mouseup event listener here is fine,
//         // but we need to ensure that it's removed properly after the mouse is up
//         window.addEventListener("mouseup", handleMouseUp);
//     }

//     function handleMouseUp() {
//         setDragging({
//             shipId: null,
//             initialX: null,
//             initialY: null,
//             initialCells: null,
//         });

//         window.removeEventListener("mouseup", handleMouseUp);
//     }

//     // Use useEffect to manage event listeners
//     useEffect(() => {
//         return () => {
//             // Clean up the event listener when the component unmounts
//             window.removeEventListener("mouseup", handleMouseUp);
//         };
//     }, []);

//     return (
//         <div>
//             <div className="game-grid__ship-cell"></div>
//         </div>
//     );
// }
