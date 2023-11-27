export default function isWithinBounds(shipCells, grid) {
  console.log("is within bounds", grid);
  return shipCells.every((cell) => {
      console.log("cell", cell);
      // Check if cell coordinates are within the grid boundaries
      if (cell.y < 0 || cell.y >= grid.length || cell.x < 0 || cell.x >= grid[cell.y].length) {
          return false;
      }

      // Check if the cell in the grid is empty
      return grid[cell.y][cell.x] === "e";
  });
}