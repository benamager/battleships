import GameGrid from "@/components/GameGrid";
import { useContext } from "react";
import { ShipsContext } from "@/contexts/ShipsContext";
import { MapContext } from "@/contexts/MapContext";

export default function Game() {
    const { shipsContext } = useContext(ShipsContext);
    const { mapContext } = useContext(MapContext);

    return (
        <main className="flex flex-col items-center mt-7">
            <h1 className="text-2xl mb-4">Battleships</h1>
            <div className="mb-8">
                <button className="bg-slate-100 rounded-md px-4 py-2 mr-8 hover:bg-slate-200">Create game</button>
                <input type="text" className="bg-slate-100 rounded-md px-4 py-2 outline-none" placeholder="Game id (e8g4s)" />
                <button className="bg-slate-100 rounded-md px-4 py-2 ml-1 hover:bg-slate-200">Join game</button>
            </div>
            <div className="flex gap-11 mx-auto">
                <div className="flex flex-col items-center gap-2">
                    <h2>You</h2>
                    <GameGrid ships={shipsContext} map={mapContext} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2>Opponent</h2>
                    <GameGrid ships={[]} map={mapContext} opponent={true} />
                </div>
            </div>
        </main>
    );
}
