import { useContext, useCallback } from "react";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";
import isPositionValid from "@/utils/isPositionValid";
import rotateShipCells from "@/utils/rotateShipCells";
import { ShipType } from "@/contexts/ShipsContext";

// Hook to shuffle ships randomly on the board
export default function useShuffleShips() {
    const { shipsContext, setShipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    const boardWidth: number = mapContext[0].length;
    const boardHeight: number = mapContext.length;

    const shuffleShips = useCallback(() => {
        const newShips: ShipType[] = JSON.parse(JSON.stringify(shipsContext)) as ShipType[];

        newShips.forEach((ship: ShipType) => {
            let validPosition: boolean = false;

            while (!validPosition) {
                // Randomly decide to rotate the ship
                if (Math.random() < 0.5) {
                    const pivotIndex: number = Math.floor(Math.random() * ship.cells.length);
                    ship.cells = rotateShipCells(ship.cells, pivotIndex);
                }

                // Generate random starting point within board bounds
                const startX: number = Math.floor(Math.random() * boardWidth);
                const startY: number = Math.floor(Math.random() * boardHeight);

                const newCells = ship.cells.map((cell) => ({
                    x: startX + cell.x - ship.cells[0].x,
                    y: startY + cell.y - ship.cells[0].y,
                }));

                const otherShips: ShipType[] = newShips.filter((s) => s.id !== ship.id);
                validPosition = isPositionValid(newCells, otherShips, mapContext);

                if (validPosition) {
                    ship.cells = newCells;
                }
            }
        });

        // Update ships context
        setShipsContext(newShips);
    }, [shipsContext, mapContext, setShipsContext, boardHeight, boardWidth]);

    return shuffleShips;
}
