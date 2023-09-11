import React from "react";
import { GameBoardProps } from "../types/GameBoard";

// Prints out the game board element based on board
const GameBoard: React.FC<GameBoardProps> = ({ board, hitCell }) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, cellIndex) => (
                        <div onClick={() => hitCell(rowIndex, cellIndex)} key={cellIndex} className={`cell ${cell} border border-gray-400 w-11 h-11 hover:bg-red-200`}></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
