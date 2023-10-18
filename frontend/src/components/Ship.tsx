import { FunctionComponent } from "react";
import { ShipProps } from "@/types/Ship";
import { useDrag } from "react-dnd";

// {
//     id: "d3F4md",
//     startPos: { x: 4, y: 1 },
//     endPos: { x: 4, y: 4 },
//     orientation: "vertical",
//     health: 4,
// }

const ItemTypes = {
    KNIGHT: "knight",
};

const Ship: FunctionComponent<ShipProps> = ({ startPos, endPos, orientation, setShips, gameGridRef, health }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.KNIGHT,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

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
            style={{
                ...positionStyles,
                ...sizeStyles,
                opacity: isDragging ? 0.5 : 1,
            }}
            // onMouseDown={startDrag}
            // onTouchStart={startDrag}
        >
            {Array.from({ length }).map((_, idx) => (
                <div className="ship__cell" key={idx}></div>
            ))}
        </div>
    );
};

export default Ship;
