import { useEffect, useState, FunctionComponent } from "react";
import { ShipProps } from "@/types/Ship";

const Ship: FunctionComponent<ShipProps> = ({ id, startPos, endPos, orientation }) => {
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
            className={`ship ship--${orientation}`}
            style={{
                ...positionStyles,
                ...sizeStyles,
                // pointerEvents: isDragging ? "none" : "auto",
            }}
            data-shipid={id}
        >
            {Array.from({ length }).map((_, idx) => (
                <div className="ship__cell" key={idx}></div>
            ))}
        </div>
    );
};

export default Ship;
