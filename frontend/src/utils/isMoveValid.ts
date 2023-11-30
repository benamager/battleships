import isWithinBounds from "@/utils/isWithinBounds";
import isCollisionFree from "@/utils/isCollisionFree";

export default function isMoveValid(newCells, otherShips, currentMap) {
  // First, check if the ship is within grid boundaries
  if (!isWithinBounds(newCells, currentMap)) {
      console.log("Move is out of bounds");
      return false;
  }

  // Then, check if the ship is colliding with any other ships
  if (!isCollisionFree(newCells, otherShips)) {
      console.log("Move causes a collision");
      return false;
  }

  // If all checks pass, the move is valid
  return true;
}