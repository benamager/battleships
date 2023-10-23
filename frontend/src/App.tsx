import "@/app.scss";
import GameGrid from "@/components/GameGrid";
import LabeledGameGrid from "@/layouts/LabeledGameGrid";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
//import { isTouchDevice } from "./utils";

export default function App() {
    const isTouchDevice = () => false;
    const DndBackend = isTouchDevice() ? TouchBackend : HTML5Backend;

    // Placeholder 2D array with empty strings
    const gridData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
    const [ships, setShips] = useState([
        {
            id: "d3F4md",
            startPos: { x: 4, y: 1 },
            endPos: { x: 4, y: 4 },
            orientation: "vertical",
            length: 4,
            health: 4,
        },
    ]);

    return (
        <DndProvider backend={DndBackend}>
            <main className="flex flex-col">
                <h1>Battleship</h1>
                <div className="flex gap-5 mx-auto">
                    <LabeledGameGrid>
                        <GameGrid gridData={gridData} ships={ships} setShips={setShips} />
                    </LabeledGameGrid>
                    <LabeledGameGrid>
                        <GameGrid gridData={gridData} />
                    </LabeledGameGrid>
                </div>
            </main>
        </DndProvider>
    );
}
