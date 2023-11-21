import "@/app.scss";
import GameGrid from "@/components/GameGrid";
import LabeledGameGrid from "@/layouts/LabeledGameGrid";
import { useState, useEffect } from "react";
import { DraggingProvider } from "@/contexts/DraggingContext";
import { maps } from "@/components/Maps";

const cellWidth = 40;
const cellHeight = 40;

export default function App() {
    const [currentMap, setCurrentMap] = useState(maps[Math.floor(Math.random() * maps.length)]);

    const [ships, setShips] = useState<ShipProps[]>([
        {
            id: "CUSTOM",
            cells: [
                { x: 2, y: 2, state: "hit" },
                { x: 2, y: 3, state: "hit" },
                { x: 3, y: 3, state: "hit" },
                { x: 3, y: 2, state: "hit" },
            ],
            health: 5,
        },
        {
            id: "CUSTOM2",
            cells: [
                { x: 6, y: 0, state: "hit" },
                { x: 6, y: 1, state: "hit" },
                { x: 6, y: 2, state: "hit" },
                { x: 6, y: 3, state: "hit" },
            ],
            health: 5,
        },
    ]);

    return (
        <DraggingProvider>
            <main className="flex flex-col">
                <h1>Battleship</h1>
                <div className="flex gap-5 mx-auto">
                    <GameGrid ships={ships} setShips={setShips} grid={currentMap} />
                    {/* <LabeledGameGrid>
                        <GameGrid />
                    </LabeledGameGrid> */}
                </div>
            </main>
        </DraggingProvider>
    );
}
