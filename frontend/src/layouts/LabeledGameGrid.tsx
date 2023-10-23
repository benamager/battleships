import { FunctionComponent, ReactNode } from "react";

// Adds the labels of letters and numbers to the sides of the game grid component.
const LabeledGameGrid: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const yAxisLabels = import.meta.env.DEV ? ["y0", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const xAxisLabels = import.meta.env.DEV ? ["x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9"] : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return (
        <div className="game-grid-labels">
            {/* yAxis (letters) */}
            <div className="game-grid-labels__letters">
                {xAxisLabels.map((letter) => (
                    <div key={letter} className="game-grid-labels__label">
                        {letter}
                    </div>
                ))}
            </div>
            {/* xAxis (numbers) */}
            <div className="game-grid-labels__numbers">
                {yAxisLabels.map((number) => (
                    <div key={number} className="game-grid-labels__label">
                        {number}
                    </div>
                ))}
            </div>
            {/* Here goes @/components/GameGrid.tsx */}
            {children}
        </div>
    );
};

export default LabeledGameGrid;
