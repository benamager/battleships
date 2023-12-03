import "@/styles/app.scss";
import GameGrid from "@/components/GameGrid";
import { ShipsContextProvider } from "@/contexts/ShipsContext";
import { MapContextProvider } from "@/contexts/MapContext";

export default function App() {
    return (
        <MapContextProvider>
            <ShipsContextProvider>
                <main className="flex flex-col">
                    <h1>Battleship</h1>
                    <div className="flex gap-11 mx-auto">
                        <GameGrid />
                    </div>
                </main>
            </ShipsContextProvider>
        </MapContextProvider>
    );
}
