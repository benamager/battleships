import { ShipType, ShipCellType} from "@/contexts/ShipsContext";

// Check if the ship is colliding with any other ships plus a one-cell margin
export default function isCollisionFree(shipCells: ShipCellType[], otherShips: ShipType[]) {
    return otherShips.every(otherShip => {
        // For each ship, iterate over all its cells
        return otherShip.cells.every(otherShipCell => {
            // Check if none of the cells of the current ship are within a one-cell margin of this cell
            return !shipCells.some(shipCell => {
                // Calculate the horizontal and vertical distances between the current cell and otherShipCell
                const horizontalDistance = Math.abs(shipCell.x - otherShipCell.x);
                const verticalDistance = Math.abs(shipCell.y - otherShipCell.y);

                // If both distances are within 1, it means shipCell is too close to otherShipCell
                return horizontalDistance <= 1 && verticalDistance <= 1;
            });
        });
    });
}

