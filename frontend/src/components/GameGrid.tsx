import { useContext, createRef, ReactElement } from "react";
import Cell from "@/components/Cell";
import Ship from "@/components/Ship";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";

export default function GameGrid(): ReactElement {
    const { shipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    // Reference passed down to useShipMove to getBoundingClientRect
    const gameGridRef = createRef<HTMLDivElement>();

    return (
        <div className="game-grid" ref={gameGridRef}>
            {/* Render 2D array as rows and columns */}
            {mapContext.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((cellValue, columnIndex) => (
                        <Cell key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} cellValue={cellValue} />
                    ))}
                </div>
            ))}

            {/* Render ships absolute on top */}
            {shipsContext.map((ship) => (
                <Ship key={ship.id} ship={ship} gameGridRef={gameGridRef} />
            ))}
        </div>
    );
}
