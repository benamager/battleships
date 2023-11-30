import { useContext } from "react";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";
import isMoveValid from "@/utils/isMoveValid";
import { ShipType } from "@/contexts/ShipsContext";

export default function useRotateShip(ship: ShipType) {
    const { shipsContext, setShipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    function rotateShip() {
        let rotated = false;

        setShipsContext((prevShips) => {
            return prevShips.map((s) => {
                if (s.id === ship.id) {
                    // Try rotating around each cell of the ship
                    for (let i = 0; i < s.cells.length; i++) {
                        const pivot = s.cells[i];
                        const newCells = s.cells.map((cell) => ({
                            x: pivot.x + cell.y - pivot.y,
                            y: pivot.y + cell.x - pivot.x,
                        }));

                        const otherShips = shipsContext.filter((s) => s.id !== ship.id);

                        if (isMoveValid(newCells, otherShips, mapContext)) {
                            if (Object.keys(newCells).length === 0 && Object.keys(newCells).length !== Object.keys(s.cells).length) {
                                console.log("No valid rotation options available");
                                return s;
                            }

                            rotated = true;
                            console.log(newCells);
                            return { ...s, cells: newCells }; // Valid rotation found, apply it
                        }
                    }

                    // If no valid rotation found, return the ship as is
                    return s;
                }
                return s;
            });
        });

        // Log to console if no valid rotation was applied
        if (!rotated) {
            console.log("No valid rotation options available");
        }
    }

    return rotateShip;
}
