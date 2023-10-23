import { useState, MouseEvent } from "react";

export default function useDragCellOffset() {
    // State to keep track of the cell offset during a drag operation
    const [dragCellOffset, setDragCellOffset] = useState<{ cellOffsetX: number; cellOffsetY: number }>();

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cellSize = 40; // Size of each grid cell

        // Calculate and set the cell offsets based on the mouse position and element location
        setDragCellOffset({
            cellOffsetX: Math.floor((e.clientX - rect.left) / cellSize), // Horizontal cell offset
            cellOffsetY: Math.floor((e.clientY - rect.top) / cellSize), // Vertical cell offset
        });
    };

    // Returning the cell offset and the mouse down handler
    return { dragCellOffset, handleMouseDown };
}
