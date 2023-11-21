export default function Cell({ x, y, cellValue, grid }) {
    const getBorderStyleForD = () => {
        let style = {};

        // Check for an "e" cell on each side and apply the border to the "d" cell
        if (y > 0 && grid[y - 1][x] === "e") {
            style.borderTop = "0.8px solid #000";
        }
        if (y < grid.length - 1 && grid[y + 1][x] === "e") {
            style.borderBottom = "0.8px solid #000";
        }
        if (x > 0 && grid[y][x - 1] === "e") {
            style.borderLeft = "0.8px solid #000";
        }
        if (x < grid[y].length - 1 && grid[y][x + 1] === "e") {
            style.borderRight = "0.8px solid #000";
        }

        return style;
    };

    const getBorderStyleForE = () => {
        let style = {};

        // Add thicker border for outermost "e" cells
        if (y === 0) {
            style.borderTop = "1.4px solid #000";
        }
        if (y === grid.length - 1) {
            style.borderBottom = "1.4px solid #000";
        }
        if (x === 0) {
            style.borderLeft = "1.4px solid #000";
        }
        if (x === grid[0].length - 1) {
            style.borderRight = "1.4px solid #000";
        }

        return style;
    };

    let borderStyleForD = getBorderStyleForD();
    let borderStyleForE = getBorderStyleForE();

    if (cellValue === "e") {
        return <div className="game-grid__cell" style={borderStyleForE}></div>;
    }

    if (cellValue === "d") {
        return <div className="game-grid__cell game-grid__cell--blank" style={borderStyleForD}></div>;
    }
}
