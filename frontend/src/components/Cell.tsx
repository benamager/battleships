import { useContext, CSSProperties } from "react";
import { MapContext } from "@/contexts/MapContext";

interface CellProps {
    x: number;
    y: number;
    cellValue: string;
}

/*  Returns two types of cells:
        - "e" cell: empty cell
        - "d" cell: dummy cell
    They are both rendered the same way, but "d" cells are invisible to the player.

    Also applies border styling to cells based on their neighbors.
*/
export default function Cell({ x, y, cellValue }: CellProps) {
    const { mapContext } = useContext(MapContext);

    if (cellValue === "e") {
        const style: CSSProperties = {};

        // Apply extra border width to cells on the edge of the map
        if (y === 0) {
            style.borderTop = "1.4px solid #000";
        }
        if (y === mapContext.length - 1) {
            style.borderBottom = "1.4px solid #000";
        }
        if (x === 0) {
            style.borderLeft = "1.4px solid #000";
        }
        if (x === mapContext[0].length - 1) {
            style.borderRight = "1.4px solid #000";
        }

        return <div className="game-grid__cell" style={style}></div>;
    }

    if (cellValue === "d") {
        const style: CSSProperties = {};

        // Check for an "e" cell on each side and apply the border to that sides "d" cell
        if (y > 0 && mapContext[y - 1][x] === "e") {
            style.borderTop = "0.8px solid #000";
        }
        if (y < mapContext.length - 1 && mapContext[y + 1][x] === "e") {
            style.borderBottom = "0.8px solid #000";
        }
        if (x > 0 && mapContext[y][x - 1] === "e") {
            style.borderLeft = "0.8px solid #000";
        }
        if (x < mapContext[y].length - 1 && mapContext[y][x + 1] === "e") {
            style.borderRight = "0.8px solid #000";
        }

        return <div className="game-grid__cell game-grid__cell--blank" style={style}></div>;
    }

    return null;
}
