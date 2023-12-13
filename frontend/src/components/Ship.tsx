import { useRef, RefObject } from "react";
import shipCellHasNeighbor from "@/utils/shipCellHasNeighbor";
import useShipMove from "@/hooks/interaction/useShipMove";
import { ShipType } from "@/contexts/ShipsContext";

const cellWidthHeight = 40;

interface ShipPropsType {
    ship: ShipType;
    gameGridRef: RefObject<HTMLDivElement>;
}

export default function Ship({ ship, gameGridRef }: ShipPropsType) {
    // Calculate width and height of ships container based on the largest x and y values.
    const shipWidth = (Math.max(...ship.cells.map((cell) => cell.x)) - Math.min(...ship.cells.map((cell) => cell.x)) + 1) * cellWidthHeight;
    const shipHeight = (Math.max(...ship.cells.map((cell) => cell.y)) - Math.min(...ship.cells.map((cell) => cell.y)) + 1) * cellWidthHeight;

    // To calculate relativeX and Y in useShipMove
    const shipContainerRef = useRef<HTMLDivElement>(null);

    const { dragging, handleMouseDown, topPosition, leftPosition } = useShipMove({ ship, shipContainerRef, gameGridRef });

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
                const borderColor = dragging.canPlace ? (dragging.isDragging ? "green" : "#0022ff") : "rgba(255, 0, 0, 0.8)";

                // Determine which borders to apply based on neighboring cells
                const borderTop = shipCellHasNeighbor(ship, cell, "top") ? "none" : `2px solid ${borderColor}`;
                const borderBottom = shipCellHasNeighbor(ship, cell, "bottom") ? "none" : `2px solid ${borderColor}`;
                const borderLeft = shipCellHasNeighbor(ship, cell, "left") ? "none" : `2px solid ${borderColor}`;
                const borderRight = shipCellHasNeighbor(ship, cell, "right") ? "none" : `2px solid ${borderColor}`;

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
                            zIndex: dragging.isDragging ? 1 : 0,
                        }}
                    />
                );
            })}
        </div>
    );
}
