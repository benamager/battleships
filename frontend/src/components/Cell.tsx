export default function Cell({ x, y, cellValue }) {
    // console.log(cellValue);

    if (cellValue === "e") {
        return <div className="game-grid__cell"></div>;
    }

    if (cellValue === "") {
        return <div className="game-grid__cell game-grid__cell--blank"></div>;
    }
}
