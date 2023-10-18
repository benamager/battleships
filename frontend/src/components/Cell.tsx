import { useDrop } from "react-dnd";

const ItemTypes = {
    KNIGHT: "knight",
};

export default function Cell({ x, y }) {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.KNIGHT,
            drop: () => console.log(x, y),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                some: console.log(monitor),
            }),
        }),
        [x, y]
    );

    return (
        <div ref={drop} className="game-grid__cell relative">
            {isOver && <div className="absolute inset-0 bg-green-200"></div>}
        </div>
    );
}
