import { ShipCellType } from "@/contexts/ShipsContext";

// Rotate ship cells around pivot
export default function rotateShipCells(cells: ShipCellType[], pivotIndex: number) {
  const pivot = cells[pivotIndex];
  return cells.map(cell => ({
      x: pivot.x + cell.y - pivot.y,
      y: pivot.y + cell.x - pivot.x,
  }));
}
