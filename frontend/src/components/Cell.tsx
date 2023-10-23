import { useDrop } from "react-dnd";
import RussianShipTypes from "@/constants/RussianShipTypes";

interface Position {
    x: number;
    y: number;
}

interface Ship {
    id: string;
    startPos: Position;
    endPos: Position;
    orientation: "horizontal" | "vertical";
    length: number;
    health: number;
}

export default function Cell({ x, y, setShips }) {
    const moveShip = (shipId: string, toX: number, toY: number) => {
        setShips((prevShips: Ship[]) => {
            return prevShips.map((ship: Ship) => {
                if (ship.id === shipId) {
                    // New start position
                    const newStartPos: Position = { x: toX, y: toY };

                    // Calculate new end position based on the orientation and length of the ship
                    const newEndPos: Position = {
                        x: ship.orientation === "horizontal" ? toX + ship.length - 1 : toX,
                        y: ship.orientation === "vertical" ? toY + ship.length - 1 : toY,
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

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: Object.keys(RussianShipTypes), // Accepts all types defined
            drop: (item, monitor) => {
                const { id, startPos, endPos, orientation, dragCellOffset } = item;
                const { cellOffsetX, cellOffsetY } = dragCellOffset;

                // // Calculate new start position
                const newStartPos: Position = {
                    x: x - cellOffsetX,
                    y: y - cellOffsetY,
                };
                console.log("newStartPos", newStartPos);
                moveShip(item.id, newStartPos.x, newStartPos.y); // Pass the ship id and new x, y coordinates
            },
            hover: (item, monitor) => {
                const { id, startPos, endPos, orientation, dragCellOffset } = item;
                const { cellOffsetX, cellOffsetY } = dragCellOffset;

                // // Calculate new start position
                const newStartPos: Position = {
                    x: x - cellOffsetX,
                    y: y - cellOffsetY,
                };
                console.log("newStartPos", newStartPos);

                if (!monitor.isOver()) {
                    return;
                }
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [x, y],
    );

    return (
        <div ref={drop} className="game-grid__cell relative">
            {isOver && <div className="absolute inset-0 bg-green-200"></div>}
        </div>
    );
}
