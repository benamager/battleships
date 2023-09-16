import { FunctionComponent, ReactNode } from "react";

interface LabeledGameGridProps {
    children: ReactNode;
}

// Adds the labels of letters and numbers to the sides of the game grid.
const LabeledGameGrid: FunctionComponent<LabeledGameGridProps> = ({ children }) => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, 3, ..., 10]

    return (
        <div className="game-grid-labels">
            {/* Letter labels */}
            <div className="game-grid-labels__letters">
                {letters.map((letter) => (
                    <div key={letter} className="game-grid-labels__label">
                        {letter}
                    </div>
                ))}
            </div>
            {/* Number labels */}
            <div className="game-grid-labels__numbers">
                {numbers.map((number) => (
                    <div key={number} className="game-grid-labels__label">
                        {number}
                    </div>
                ))}
            </div>
            {/* Here goes components/GameGrid.tsx */}
            {children}
        </div>
    );
};

export default LabeledGameGrid;
