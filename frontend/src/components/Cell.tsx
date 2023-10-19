import { useDrop } from "react-dnd";

const ItemTypes = {
    KNIGHT: "knight",
};

interface Position {
    x: number;
    y: number;
}

interface Ship {
    id: string;
    startPos: Position;
    endPos: Position;
    orientation: "horizontal" | "vertical";
    length: number;
    health: number;
}

export default function Cell({ x, y, setShips }) {
    const moveShip = (shipId: string, toX: number, toY: number) => {
        setShips((prevShips: Ship[]) => {
            return prevShips.map((ship: Ship) => {
                if (ship.id === shipId) {
                    // New start position
                    const newStartPos: Position = { x: toX, y: toY };

                    // Calculate new end position based on the orientation and length of the ship
                    const newEndPos: Position = {
                        x: ship.orientation === "horizontal" ? toX + ship.length - 1 : toX,
                        y: ship.orientation === "vertical" ? toY + ship.length - 1 : toY,
                    };

                    // Returning a new ship object with updated positions
                    return {
                        ...ship,
                        startPos: newStartPos,
                        endPos: newEndPos,
                    };
                }

                // If the ship is not the one being moved, return it as is
                return ship;
            });
        });
    };

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.KNIGHT,
            drop: (item, monitor) => {
                // const { x: g, y: j } = monitor.getDifferenceFromInitialOffset();
                // console.log(g / 40);
                // console.log(j / 40);
                moveShip(item.id, x, y); // Pass the ship id and new x, y coordinates
            },
            // hover: (item, monitor) => {
            //     if (!monitor.isOver()) {
            //         return;
            //     }

            //     const newStartX = x; // New cell position where you want to move the ship
            //     const newStartY = y; // New cell position where you want to move the ship

            //     moveShip(item.id, newStartX, newStartY);
            // },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [x, y],
    );

    return (
        <div ref={drop} className="game-grid__cell relative">
            {isOver && <div className="absolute inset-0 bg-green-200"></div>}
        </div>
    );
}
