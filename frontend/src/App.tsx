import "./app.scss";

export default function App() {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, 3, ..., 10]

    return (
        <main>
            <h1>Battleship</h1>
            <div className="game-grid-wrapper">
                {/* Letter labels */}
                <div className="game-grid__row">
                    <div className="game-grid__cell game-grid__cell--hidden" />
                    {letters.map((letter) => (
                        <div key={letter} className="game-grid__cell game-grid__cell--hidden">
                            {letter}
                        </div>
                    ))}
                </div>
                <div className="game-grid__alignment">
                    {/* Number labels */}
                    <div className="game-grid__column">
                        {numbers.map((number) => (
                            <div key={number} className="game-grid__cell game-grid__cell--hidden">
                                {number}
                            </div>
                        ))}
                    </div>
                    {/* 2D array - game grid */}
                    <div className="game-grid">
                        {Array.from({ length: 10 }, (_, row) => (
                            <div className="game-grid__row" key={row}>
                                {Array.from({ length: 10 }, (_, column) => (
                                    <div className="game-grid__cell" key={column} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
