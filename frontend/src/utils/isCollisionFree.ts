// Check if the ship is colliding with any other ships
export default function isCollisionFree(shipCells, otherShips) {
  return otherShips.every((otherShip) => {
      return otherShip.cells.every((otherShipCell) => {
          return !shipCells.some((shipCell) => {
              return shipCell.x === otherShipCell.x && shipCell.y === otherShipCell.y;
          });
      });
  });
}