import React, { useEffect, useContext, useRef, useState, useReducer, useCallback, MouseEvent } from "react";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";
import isPositionValid from "@/utils/isPositionValid";
import { ShipType } from "@/contexts/ShipsContext";
import useRotateShip from "@/hooks/interaction/useRotateShip";

const cellWidthHeight = 40;

// Define the state structure
interface StateType {
    topPosition: number;
    leftPosition: number;
}

// Define action types
type ActionType = { type: "UPDATE_POSITION"; payload: { cells: { x: number; y: number }[] } } | { type: "SET_DIRECT_POSITION"; payload: { top: number; left: number } };

// Reducer function with types
function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case "UPDATE_POSITION":
            const newTop = Math.min(...action.payload.cells.map((cell) => cell.y)) * cellWidthHeight;
            const newLeft = Math.min(...action.payload.cells.map((cell) => cell.x)) * cellWidthHeight;

            return {
                ...state,
                topPosition: newTop,
                leftPosition: newLeft,
            };
        case "SET_DIRECT_POSITION":
            return {
                ...state,
                topPosition: action.payload.top,
                leftPosition: action.payload.left,
            };
        default:
            throw new Error();
    }
}

interface ShipMoveType {
    ship: ShipType;
    shipContainerRef: React.RefObject<HTMLDivElement>;
    gameGridRef: React.RefObject<HTMLDivElement>;
}

export default function useShipMove({ ship, shipContainerRef, gameGridRef }: ShipMoveType) {
    const { shipsContext, setShipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    const rotateShip = useRotateShip(ship);

    const initialState = {
        topPosition: Math.min(...ship.cells.map((cell) => cell.y)) * cellWidthHeight,
        leftPosition: Math.min(...ship.cells.map((cell) => cell.x)) * cellWidthHeight,
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({
            type: "UPDATE_POSITION",
            payload: { cells: ship.cells },
        });
    }, [ship]);

    // Store some information while dragging
    const [dragging, setDragging] = useState({
        isDragging: false,
        initialX: 0,
        initialY: 0,
        relativeX: 0,
        relativeY: 0,
        canPlace: true,
        newCells: [],
    });

    /*  Storing states in ref for access in event listeners
        useEffects updates them on change */
    const shipCellsRef = useRef(ship.cells);
    const draggingRef = useRef(dragging);
    const mapContextRef = useRef(mapContext);

    /*  On mouse move we have two states it can be in visually.
            - If it can place it will follow the gameGrid cells.
            - If it can't place it will follow the mouse.
    */
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();

            const currentDragging = draggingRef.current;

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
            const canPlace = isPositionValid(newCells, otherShips, mapContextRef.current);
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
                dispatch({
                    type: "SET_DIRECT_POSITION",
                    payload: { top: relativeTop, left: relativeLeft },
                });
            }

            if (canPlace === true) {
                console.log("can place, follow grid");
                setDragging((prevState) => ({ ...prevState, newCells: newCells }));
                dispatch({
                    type: "UPDATE_POSITION",
                    payload: { cells: newCells },
                });
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
        if (draggingRef.current.isDragging === false) {
            console.log("mouse up without movement");
            rotateShip();

            dispatch({
                type: "UPDATE_POSITION",
                payload: { cells: draggingRef.current.newCells },
            });

            setDragging({
                isDragging: false,
                initialX: 0,
                initialY: 0,
                relativeX: 0,
                relativeY: 0,
                canPlace: true,
                newCells: [],
            });

            console.log("Ship rotated");
            return;
        }

        console.log("mouse up with movement");
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

        setDragging({
            isDragging: false,
            initialX: 0,
            initialY: 0,
            relativeX: 0,
            relativeY: 0,
            canPlace: true,
            newCells: [],
        });

        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    // Update draggingRef whenever dragging changes
    useEffect(() => {
        draggingRef.current = dragging;
    }, [dragging, ship]);
    useEffect(() => {
        shipCellsRef.current = ship.cells;
    }, [ship]);
    useEffect(() => {
        mapContextRef.current = mapContext;
    }, [mapContext]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseUp, handleMouseMove]);

    return { handleMouseDown, handleMouseUp, handleMouseMove, dragging, topPosition: state.topPosition, leftPosition: state.leftPosition };
}
