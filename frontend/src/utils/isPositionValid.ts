import isWithinBounds from "@/utils/isWithinBounds";
import isCollisionFree from "@/utils/isCollisionFree";
import { ShipType, ShipCellType} from "@/contexts/ShipsContext";
import { MapType } from "@/contexts/MapContext";

export default function isPositionValid(newCells: ShipCellType[], otherShips: ShipType[], currentMap: MapType) {
  // First, check if the ship is within grid boundaries
  if (!isWithinBounds(newCells, currentMap)) {
      return false;
  }

  // Then, check if the ship is colliding with any other ships
  if (!isCollisionFree(newCells, otherShips)) {
      return false;
  }

  // If all checks pass, the move is valid
  return true;
}