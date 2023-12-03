import { ShipType, ShipCellType } from "@/contexts/ShipsContext";

// Function to check if a neighboring cell exists for the ship
export default function shipCellHasNeighbor(ship: ShipType, cell: ShipCellType, direction: "left" | "right" | "top" | "bottom") {
  if (direction === "left") {
      return ship.cells.some((c) => c.x === cell.x - 1 && c.y === cell.y);
  } else if (direction === "right") {
      return ship.cells.some((c) => c.x === cell.x + 1 && c.y === cell.y);
  } else if (direction === "top") {
      return ship.cells.some((c) => c.x === cell.x && c.y === cell.y - 1);
  } else if (direction === "bottom") {
      return ship.cells.some((c) => c.x === cell.x && c.y === cell.y + 1);
  }
  return false;
}