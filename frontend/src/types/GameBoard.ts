export type Cell = "empty" | "ship" | "hit" | "miss"; // Cell options
export type Board = Cell[][];

// Props for the GameBoard component
export interface GameBoardProps {
  board: Board;  // 2D array of cells
  hitCell: (rowIndex: number, cellIndex: number) => void;  // Function to hit a cell
}

export interface PlayerState {
  board: Board;
  hits: number;
  misses: number;
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentPlayer: 'player1' | 'player2' | null; // Identifying who's turn it is
  gameStatus: 'waiting' | 'placing' | 'playing' | 'finished';
}