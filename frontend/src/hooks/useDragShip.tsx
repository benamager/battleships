import React, { useState, useEffect, useCallback } from "react";

interface Position {
    x: number;
    y: number;
}

// Defines props for our custom hook
interface UseDragShipProps {
    initialPosition: Position;
}

const useDragShip = ({ initialPosition }: UseDragShipProps) => {
    const [isDragging, setIsDragging] = useState(false);
    // State to store the starting position when dragging begins
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    // State to store the current position of the draggable item
    const [position, setPosition] = useState(initialPosition);

    // Function to start the dragging process
    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.type === "touchstart" ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX,
            y: e.type === "touchstart" ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY,
        });
    };

    // Function to move the ship as the user drags
    const moveShip = useCallback(
        (e: MouseEvent | TouchEvent) => {
            // If not dragging, don't do anything
            if (!isDragging) return;

            // Get the current position of the mouse/touch
            const currentX = e.type === "touchmove" ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const currentY = e.type === "touchmove" ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

            // Calculate the difference (delta) from the starting drag position
            const deltaX = currentX - dragStart.x;
            const deltaY = currentY - dragStart.y;

            // Set the new position of the draggable item based on the delta
            setPosition({
                x: position.x + deltaX,
                y: position.y + deltaY,
            });

            // Update dragStart to the current position for the next movement,
            // ensuring that deltas are relative to the last known position
            setDragStart({ x: currentX, y: currentY });
        },
        [isDragging, dragStart, position]
    );

    const endDrag = () => {
        setIsDragging(false);
    };

    // useEffect to add event listeners for dragging and cleanup afterwards
    useEffect(() => {
        window.addEventListener("mousemove", moveShip);
        window.addEventListener("touchmove", moveShip);
        window.addEventListener("mouseup", endDrag);
        window.addEventListener("touchend", endDrag);

        return () => {
            // Cleanup - remove event listeners when the component unmounts
            window.removeEventListener("mousemove", moveShip);
            window.removeEventListener("touchmove", moveShip);
            window.removeEventListener("mouseup", endDrag);
            window.removeEventListener("touchend", endDrag);
        };
    }, [isDragging, dragStart, moveShip]);

    // Return the position and startDrag function for use in the ship component
    return { position, startDrag };
};

export default useDragShip;
