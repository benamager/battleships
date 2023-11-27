import "@/app.scss";
import GameGrid from "@/components/GameGrid";
import { useState } from "react";
import { maps } from "@/components/Maps";
import { ShipsContextProvider } from "@/contexts/ShipsContext";

export default function App() {
    const [currentMap] = useState(maps[Math.floor(Math.random() * maps.length)]);

    return (
        <ShipsContextProvider>
            <main className="flex flex-col">
                <h1>Battleship</h1>
                <div className="flex gap-5 mx-auto">
                    <GameGrid grid={currentMap} />
                </div>
            </main>
        </ShipsContextProvider>
    );
}
