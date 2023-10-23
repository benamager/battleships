import { FunctionComponent } from "react";
import { ShipProps } from "@/types/Ship";
import { useDrag } from "react-dnd";
import useDragCellOffset from "@/hooks/interaction/useDragCellOffset";

const Ship: FunctionComponent<ShipProps> = ({ type, startPos, endPos, orientation }) => {
    // Get the cell offset X and Y during the start of a drag operation
    const { dragCellOffset, handleMouseDown } = useDragCellOffset();

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: type,
            item: () => ({ type, startPos, endPos, orientation, dragCellOffset }), // Pass the ship data to drop target
            collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
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
