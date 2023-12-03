import { ShipCellType } from "@/contexts/ShipsContext";
import { MapType } from "@/contexts/MapContext";

export default function isWithinBounds(shipCells: ShipCellType[], currentMap: MapType) {
  return shipCells.every((cell) => {
      // Check if cell coordinates are within the grid boundaries
      if (cell.y < 0 || cell.y >= currentMap.length || cell.x < 0 || cell.x >= currentMap[cell.y].length) {
          return false;
      }

      // Check if the cell in the grid is empty
      return currentMap[cell.y][cell.x] === "e";
  });
}