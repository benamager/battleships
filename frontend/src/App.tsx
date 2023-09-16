import "./app.scss";
import GameGrid from "./components/GameGrid";
import LabeledGameGrid from "./layouts/LabeledGameGrid";

export default function App() {
    //placeholder 2d array with empty strings
    const gridData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));

    return (
        <main>
            <h1>Battleship</h1>
            <div className="flex gap-5">
                <LabeledGameGrid>
                    <GameGrid gridData={gridData} />
                </LabeledGameGrid>
                <LabeledGameGrid>
                    <GameGrid gridData={gridData} />
                </LabeledGameGrid>
            </div>
        </main>
    );
}
