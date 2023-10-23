import { useState, FunctionComponent, MouseEvent } from "react";
import { ShipProps } from "@/types/Ship";
import { useDrag } from "react-dnd";

// const [ships, setShips] = useState([
//     {
//         id: "d3F4md",
//         startPos: { x: 4, y: 1 },
//         endPos: { x: 4, y: 4 },
//         orientation: "vertical",
//         length: 4,
//         health: 4,
//     },
// ]);

const ItemTypes = {
    KNIGHT: "knight",
};

const Ship: FunctionComponent<ShipProps> = ({ id, startPos, endPos, orientation, setShips, gameGridRef, health }) => {
    // Grab drag offset from cursor to ships left and top corner
    // Then we can calculate the ships proper position
    const [dragCellOffset, setDragCellOffset] = useState<{ cellOffsetX: number; cellOffsetY: number }>(null);
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cellSize = 40; // Define cell size

        // Calculate horizontal and vertical cell index from drag start position
        setDragCellOffset({
            cellOffsetX: Math.floor((e.clientX - rect.left) / cellSize),
            cellOffsetY: Math.floor((e.clientY - rect.top) / cellSize),
        });
    };

    //console.log(dragCellOffset);
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.KNIGHT,
            item: (item) => {
                return { id, startPos, endPos, orientation, dragCellOffset }; // Pass the ship details as an item
            },
            collect: (monitor) => {
                return {
                    isDragging: !!monitor.isDragging(),
                };
            },
        }),
        [dragCellOffset],
    );

    const length = orientation === "horizontal" ? endPos.x - startPos.x + 1 : endPos.y - startPos.y + 1;
    const shipSize = 40; //gameGridRef?.current.clientHeight / 10;

    const positionStyles = {
        top: startPos.y * shipSize,
        left: startPos.x * shipSize,
    };

    const sizeStyles =
        orientation === "horizontal"
            ? {
                  width: length * shipSize,
                  height: shipSize,
              }
            : {
                  height: length * shipSize,
                  width: shipSize,
              };

    return (
        <div
            ref={drag}
            className={`ship ship--${orientation}`}
            onMouseDown={handleMouseDown}
            style={{
                ...positionStyles,
                ...sizeStyles,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {Array.from({ length }).map((_, idx) => (
                <div className="ship__cell" key={idx}></div>
            ))}
        </div>
    );
};

export default Ship;
