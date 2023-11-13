import React, { useEffect, useRef, useState, useCallback } from "react";
import cellHasNeighbor from "@/utils/cellHasNeighbor";

const cellWidthHeight = 40;

const Ship = ({ shipId, setShips, ship, gameGridRef, ships }) => {
    const [dragging, setDragging] = useState({
        isDragging: false,
        initialX: null,
        initialY: null,
        relativeX: null,
        relativeY: null,
        canPlace: null,
        newCells: [],
    });
    const shipContainerRef = useRef<HTMLDivElement>();
    const draggingRef = useRef(dragging);
    const shipCellsRef = useRef(ship.cells);

    // Calculate the default top and left positions based on the smallest x and y values.
    const [topPosition, setTopPosition] = useState(Math.min(...ship.cells.map((cell) => cell.y)) * cellWidthHeight);
    const [leftPosition, setLeftPosition] = useState(Math.min(...ship.cells.map((cell) => cell.x)) * cellWidthHeight);

    // Calculate width and height of ship container based on the largest x and y values.
    const shipWidth = (Math.max(...ship.cells.map((cell) => cell.x)) - Math.min(...ship.cells.map((cell) => cell.x)) + 1) * cellWidthHeight;
    const shipHeight = (Math.max(...ship.cells.map((cell) => cell.y)) - Math.min(...ship.cells.map((cell) => cell.y)) + 1) * cellWidthHeight;

    /*  On mouse move we have two states it can be in visually.
        - If it can place it will follow the gameGrid cells.
        - If it can't place it will follow the mouse.
    */
    const handleMouseMove = useCallback(
        (e) => {
            const currentDragging = draggingRef.current; // Use the ref to get the current dragging state

            // Calculate the amount in cells that the ship has moved
            // Calculate the offset in pixels from the initial positions
            const offsetX = e.clientX - currentDragging.initialX;
            const offsetY = e.clientY - currentDragging.initialY;
            // Converting pixel offsets to cell offsets
            const movedCellsX = Math.round(offsetX / cellWidthHeight) || 0;
            const movedCellsY = Math.round(offsetY / cellWidthHeight) || 0;

            // This could be mapped into ships state and have some algorithm to determine if it's a valid placement
            const newCells = shipCellsRef.current.map((cell) => ({
                ...cell,
                x: cell.x + movedCellsX,
                y: cell.y + movedCellsY,
            }));

            // But for now here goes collision detection
            if (newCells.some((cell) => cell.x < 0 || cell.x > 9 || cell.y < 0 || cell.y > 9)) {
                if (currentDragging.canPlace) {
                    setDragging((prevState) => ({ ...prevState, canPlace: false, newCells }));
                }
            } else {
                if (!currentDragging.canPlace) {
                    setDragging((prevState) => ({ ...prevState, canPlace: true, newCells: shipCellsRef.current }));
                }
            }

            // Can't place, follow the mouse
            if (!currentDragging.canPlace) {
                const gridRect = gameGridRef.current.getBoundingClientRect();
                const relativeTop = e.clientY - gridRect.top - currentDragging.relativeY;
                const relativeLeft = e.clientX - gridRect.left - currentDragging.relativeX;
                setTopPosition(relativeTop);
                setLeftPosition(relativeLeft);
            }

            if (currentDragging.canPlace) {
                setTopPosition(Math.min(...newCells.map((cell) => cell.y)) * cellWidthHeight);
                setLeftPosition(Math.min(...newCells.map((cell) => cell.x)) * cellWidthHeight);
            }
        },
        [draggingRef, gameGridRef, shipCellsRef],
    );

    // On mouse down set dragging state
    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const rect = shipContainerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        setDragging({
            isDragging: true,
            initialX: e.clientX,
            initialY: e.clientY,
            relativeX,
            relativeY,
            canPlace: true,
            newCells: shipCellsRef.current,
        });

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    // Mouse up, clean up event listeners
    const handleMouseUp = useCallback(() => {
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
        // setTopPosition(Math.min(...ship.cells.map((cell) => cell.y)) * cellWidthHeight);
        // setLeftPosition(Math.min(...ship.cells.map((cell) => cell.x)) * cellWidthHeight);

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
                position: "absolute",
                top: `${topPosition}px`,
                left: `${leftPosition}px`,
                width: `${shipWidth}px`,
                height: `${shipHeight}px`,
                pointerEvents: "none",
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
                            width: "40px",
                            height: "40px",
                            position: "absolute",
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
