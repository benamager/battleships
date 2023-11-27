import React, { useEffect, useContext, useRef, useState, useCallback } from "react";
import { ShipsContext } from "@/contexts/ShipsContext";
import isMoveValid from "@/utils/isMoveValid";

const cellWidthHeight = 40;

export default function useShipMove({ currentMap, ship, shipContainerRef, gameGridRef, ships }) {
    const { shipsContext, setShipsContext } = useContext(ShipsContext);

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

    /*  Storing states in ref for access in event listeners
        useEffects updates them on change */
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

            const otherShips = shipsContext.filter((s) => s.id !== ship.id);
            // grid length and width
            const gridHeight = currentMapRef.current.length;
            const gridWidth = currentMapRef.current[0].length;
            const canPlace = isMoveValid(newCells, otherShips, currentMapRef.current);
            console.log("can place", canPlace);

            // Update dragging state based on canPlace
            if (canPlace === true && currentDragging.canPlace === false) {
                setDragging((prevState) => ({ ...prevState, canPlace, newCells }));
            }
            if (canPlace === false && currentDragging.canPlace === true) {
                setDragging((prevState) => ({ ...prevState, canPlace }));
            }

            if (canPlace === false) {
                console.log("can't place, follow mouse");
                const gridRect = gameGridRef.current.getBoundingClientRect();
                const relativeTop = e.clientY - gridRect.top - currentDragging.relativeY;
                const relativeLeft = e.clientX - gridRect.left - currentDragging.relativeX;
                setTopPosition(relativeTop);
                setLeftPosition(relativeLeft);
            }

            if (canPlace === true) {
                console.log("can place, follow grid");
                setTopPosition(Math.min(...newCells.map((cell) => cell.y)) * cellWidthHeight);
                setLeftPosition(Math.min(...newCells.map((cell) => cell.x)) * cellWidthHeight);

                setDragging((prevState) => ({ ...prevState, newCells: newCells }));
            }
        },
        [draggingRef, shipCellsRef, cellWidthHeight, gameGridRef, shipsContext],
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
        setShipsContext((prevShips) => {
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

    return { topPosition, leftPosition, handleMouseDown, handleMouseUp, handleMouseMove, dragging };
}
