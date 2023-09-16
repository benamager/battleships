import { FunctionComponent } from "react";
import useDragShip from "../hooks/useDragShip";

interface ShipProps {
    length: number;
    direction: "horizontal" | "vertical";
    position: { x: number; y: number };
}

const Ship: FunctionComponent<ShipProps> = ({ length, direction, position }) => {
    const { position: shipPosition, startDrag } = useDragShip({ initialPosition: position });

    return (
        <div
            className={`ship ship--${direction}`}
            style={{
                top: shipPosition.y,
                left: shipPosition.x,
            }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
        >
            {Array.from({ length }).map((_, idx) => (
                <div className="ship__cell" key={idx}></div>
            ))}
        </div>
    );
};

export default Ship;
