import { ShipCellType } from "@/contexts/ShipsContext";

export default function rotateShip(cells: ShipCellType[], i: number) {
  const pivot = cells[i];
  const newCells = cells.map((cell) => ({
      x: pivot.x + cell.y - pivot.y,
      y: pivot.y + cell.x - pivot.x,
  }));

  return newCells
}