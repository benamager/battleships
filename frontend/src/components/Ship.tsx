import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import cellHasNeighbor from "@/utils/cellHasNeighbor";
import { DraggingContext } from "@/contexts/DraggingContext";
//import { throttle } from "lodash";

const cellWidthHeight = 40;

function isWithinBounds(shipCells, grid) {
    console.log("is within bounds", grid);
    return shipCells.every((cell) => {
        console.log("cell", cell);
        // Check if cell coordinates are within the grid boundaries
        if (cell.y < 0 || cell.y >= grid.length || cell.x < 0 || cell.x >= grid[cell.y].length) {
            return false;
        }

        // Check if the cell in the grid is empty
        return grid[cell.y][cell.x] === "e";
    });
}

// Check if the ship is colliding with any other ships
function isCollisionFree(shipCells, otherShips) {
    return otherShips.every((otherShip) => {
        return otherShip.cells.every((otherShipCell) => {
            return !shipCells.some((shipCell) => {
                return shipCell.x === otherShipCell.x && shipCell.y === otherShipCell.y;
            });
        });
    });
}
function isMoveValid(cells, otherShips, currentMap) {
    // First, check if the ship is within grid boundaries
    if (!isWithinBounds(cells, currentMap)) {
        console.log("Move is out of bounds");
        return false;
    }

    // Then, check if the ship is colliding with any other ships
    if (!isCollisionFree(cells, otherShips)) {
        console.log("Move causes a collision");
        return false;
    }

    // If all checks pass, the move is valid
    return true;
}

const Ship = ({ shipId, setShips, ship, gameGridRef, ships, currentMap }) => {
    // Store some information while dragging
    const [dragging, setDragging] = useState({
        isDragging: false,
        initialX: null,
        initialY: null,
        relativeX: null,
        relativeY: null,
        canPlace: null,
        newCells: [],
    });
    // Ships top and left position based on the smallest x and y values.
    const [topPosition, setTopPosition] = useState(Math.min(...ship.cells.map((cell) => cell.y)) * cellWidthHeight);
    const [leftPosition, setLeftPosition] = useState(Math.min(...ship.cells.map((cell) => cell.x)) * cellWidthHeight);
    // Calculate width and height of ships container based on the largest x and y values.
    const shipWidth = (Math.max(...ship.cells.map((cell) => cell.x)) - Math.min(...ship.cells.map((cell) => cell.x)) + 1) * cellWidthHeight;
    const shipHeight = (Math.max(...ship.cells.map((cell) => cell.y)) - Math.min(...ship.cells.map((cell) => cell.y)) + 1) * cellWidthHeight;

    /*  Storing states in ref for access in event listeners
        useEffects updates them on change */
    const shipContainerRef = useRef<HTMLDivElement>(); // To get bounding client rect
    const shipCellsRef = useRef(ship.cells);
    const draggingRef = useRef(dragging);
    const currentMapRef = useRef(currentMap);

    /*  On mouse move we have two states it can be in visually.
        - If it can place it will follow the gameGrid cells.
        - If it can't place it will follow the mouse.
    */
    const handleMouseMove = useCallback(
        (e) => {
            e.preventDefault();
            const currentDragging = draggingRef.current; // Use ref to get current dragging state

            // If not dragging yet
            if (currentDragging.isDragging === false) {
                // if mouse has moved enough (10px) either horizontally or vertically to start dragging
                if (Math.abs(e.clientX - currentDragging.initialX) < 5 && Math.abs(e.clientY - currentDragging.initialY) < 5) {
                    console.log("hasn't moved enough to start dragging");
                    return;
                } else {
                    // Update dragging state to start dragging
                    console.log("started dragging");
                    setDragging((prevState) => ({ ...prevState, isDragging: true }));
                }
            }

            // Calculate the offset in pixels from the initial positions
            const offsetX = e.clientX - currentDragging.initialX;
            const offsetY = e.clientY - currentDragging.initialY;
            // Converting pixel offsets to cell offsets.
            const movedCellsX = Math.round(offsetX / cellWidthHeight) || 0;
            const movedCellsY = Math.round(offsetY / cellWidthHeight) || 0;

            // This could be mapped into ships state and have some algorithm to determine if it's a valid placement
            const newCells = shipCellsRef.current.map((cell) => ({
                ...cell,
                x: cell.x + movedCellsX,
                y: cell.y + movedCellsY,
            }));

            const otherShips = ships.filter((s) => s.id !== ship.id);
            // grid length and width
            const gridHeight = currentMapRef.current.length;
            const gridWidth = currentMapRef.current[0].length;
            const canPlace = isMoveValid(newCells, otherShips, currentMapRef.current);
            console.log("can place", canPlace);

            // Update dragging state based on canPlace
            if (canPlace && !currentDragging.canPlace) {
                setDragging((prevState) => ({ ...prevState, canPlace, newCells }));
            }
            if (!canPlace && currentDragging.canPlace) {
                setDragging((prevState) => ({ ...prevState, canPlace }));
            }

            // But for now here goes collision detection
            // If any of the cells are outside the grid

            // if (currentDragging.canPlace) {
            //     console.log("CAN'T place");
            //     setDragging((prevState) => ({ ...prevState, canPlace, newCells }));
            //     return;
            // }
            // if (!currentDragging.canPlace) {
            //     console.log("CAN NOW PLACE AGAIN");
            //     setDragging((prevState) => ({ ...prevState, canPlace, newCells }));
            //     // const gridRect = gameGridRef.current.getBoundingClientRect();
            //     // const relativeTop = e.clientY - gridRect.top - currentDragging.relativeY;
            //     // const relativeLeft = e.clientX - gridRect.left - currentDragging.relativeX;
            //     // setTopPosition(relativeTop);
            //     // setLeftPosition(relativeLeft);
            // }

            if (!canPlace) {
                console.log("can't place, follow mouse");
                const gridRect = gameGridRef.current.getBoundingClientRect();
                const relativeTop = e.clientY - gridRect.top - currentDragging.relativeY;
                const relativeLeft = e.clientX - gridRect.left - currentDragging.relativeX;
                setTopPosition(relativeTop);
                setLeftPosition(relativeLeft);
            }

            if (canPlace) {
                console.log("can place, follow grid");
                setTopPosition(Math.min(...newCells.map((cell) => cell.y)) * cellWidthHeight);
                setLeftPosition(Math.min(...newCells.map((cell) => cell.x)) * cellWidthHeight);

                setDragging((prevState) => ({ ...prevState, newCells: newCells }));
            }
        },
        [draggingRef, shipCellsRef, cellWidthHeight, gameGridRef],
    );

    // On mouse down set dragging state and add event listeners
    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        console.log("mouse down", e);
        const rect = shipContainerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        setDragging({
            isDragging: false, // Not until mouse moves enough
            initialX: e.clientX,
            initialY: e.clientY,
            relativeX,
            relativeY,
            canPlace: true, // Assume it can place until it can't
            newCells: shipCellsRef.current, // Start with the original cells
        });

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    // Mouse up, clean up event listeners
    const handleMouseUp = useCallback(() => {
        console.log("mouse up WITH movement", draggingRef.current);
        setShips((prevShips) => {
            return prevShips.map((s) => {
                if (s.id === ship.id) {
                    return {
                        ...s,
                        cells: draggingRef.current.newCells,
                    };
                }
                return s;
            });
        });
        setTopPosition(Math.min(...draggingRef.current.newCells.map((cell) => cell.y)) * cellWidthHeight);
        setLeftPosition(Math.min(...draggingRef.current.newCells.map((cell) => cell.x)) * cellWidthHeight);

        setDragging({
            isDragging: false,
            initialX: null,
            initialY: null,
            relativeX: null,
            relativeY: null,
            canPlace: null,
            newCells: [],
        });

        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    // Update draggingRef whenever dragging changes
    useEffect(() => {
        draggingRef.current = dragging;
    }, [dragging]);
    useEffect(() => {
        shipCellsRef.current = ship.cells;
    }, [ship]);
    useEffect(() => {
        currentMapRef.current = currentMap;
    }, [currentMap]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseUp, handleMouseMove]);

    return (
        <div
            ref={shipContainerRef}
            className="game-grid__ship"
            style={{
                top: `${topPosition}px`,
                left: `${leftPosition}px`,
                width: `${shipWidth}px`,
                height: `${shipHeight}px`,
            }}
        >
            {ship.cells.map((cell, index) => {
                const borderColor = dragging.isDragging ? "green" : "#0022ff";

                // Determine which borders to apply based on neighboring cells
                const borderTop = cellHasNeighbor(ship, cell, "top") ? "none" : `2px solid ${borderColor}`;
                const borderBottom = cellHasNeighbor(ship, cell, "bottom") ? "none" : `2px solid ${borderColor}`;
                const borderLeft = cellHasNeighbor(ship, cell, "left") ? "none" : `2px solid ${borderColor}`;
                const borderRight = cellHasNeighbor(ship, cell, "right") ? "none" : `2px solid ${borderColor}`;

                let backgroundColor = "rgba(0, 0, 255, 0.2)";
                if (dragging.isDragging) backgroundColor = "rgba(0, 255, 0, 0.2)";
                if (dragging.isDragging && !dragging.canPlace) backgroundColor = "rgba(255, 0, 0, 0.2)";

                return (
                    <div
                        onMouseDown={handleMouseDown}
                        key={index}
                        className="game-grid__ship-cell"
                        style={{
                            left: `${(cell.x - Math.min(...ship.cells.map((c) => c.x))) * 40}px`,
                            top: `${(cell.y - Math.min(...ship.cells.map((c) => c.y))) * 40}px`,
                            borderTop,
                            borderBottom,
                            borderLeft,
                            borderRight,
                            backgroundColor,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Ship;
