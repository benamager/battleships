import { useContext, createRef, ReactElement } from "react";
import Cell from "@/components/Cell";
import Ship from "@/components/Ship";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";
import { FaShuffle } from "react-icons/fa6";
import useShuffleShips from "@/hooks/interaction/useShuffleShips";

export default function GameGrid(): ReactElement {
    const { shipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    // Reference passed down to useShipMove to getBoundingClientRect
    const gameGridRef = createRef<HTMLDivElement>();

    const shuffleShips = useShuffleShips();

    return (
        <div className="flex gap-5">
            <FaShuffle onClick={shuffleShips} size={24} className="p-2 box-content rounded-md hover:bg-slate-100 cursor-pointer" />
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
        </div>
    );
}
