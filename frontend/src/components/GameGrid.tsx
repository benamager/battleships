import { useContext, createRef, FunctionComponent } from "react";
import Cell from "@/components/Cell";
import Ship from "@/components/Ship";
import { ShipsContext } from "@/contexts/ShipsContext";

const GameGrid: FunctionComponent<> = ({ grid }) => {
    const { shipsContext } = useContext(ShipsContext);

    const gameGridRef = createRef<HTMLDivElement>();

    return (
        <div className="game-grid" ref={gameGridRef}>
            {/* Render 2D grid with ships integrated */}
            {grid.map((rowData, rowIndex) => (
                <div className="game-grid__row" key={rowIndex}>
                    {rowData.map((cellValue, columnIndex) => (
                        <Cell key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} cellValue={cellValue} grid={grid} />
                    ))}
                </div>
            ))}

            {/* Render ships */}
            {shipsContext.map((ship) => (
                <Ship key={ship.id} ship={ship} shipId={ship.id} gameGridRef={gameGridRef} currentMap={grid} />
            ))}
        </div>
    );
};

export default GameGrid;
