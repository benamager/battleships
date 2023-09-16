import "./app.scss";
import GameGrid from "./components/GameGrid";
import LabeledGameGrid from "./layouts/LabeledGameGrid";
import { useState } from "react";

export default function App() {
    //placeholder 2d array with empty strings
    const gridData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
    const [ships, setShips] = useState([
        { id: 1, position: { x: 0, y: 0 }, direction: "vertical", length: 4 },
        // ... other ships
    ]);

    return (
        <main>
            <h1>Battleship</h1>
            <div className="flex gap-5">
                <LabeledGameGrid>
                    <GameGrid gridData={gridData} ships={ships} />
                </LabeledGameGrid>
                <LabeledGameGrid>
                    <GameGrid gridData={gridData} />
                </LabeledGameGrid>
            </div>
        </main>
    );
}
