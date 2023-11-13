// Function to check if a neighboring cell exists in the ship
export default function cellHasNeighbor(ship, cell, direction) {
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