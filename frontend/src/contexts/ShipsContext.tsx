import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface ShipType {
    id: string;
    cells: { x: number; y: number }[];
    health: number;
}

const ShipsContextValueType = {
    shipsContext: [],
    setShipsContext: () => {},
};

const ShipsContext = createContext<{
    shipsContext: ShipType[];
    setShipsContext: Dispatch<SetStateAction<ShipType[]>>;
}>(ShipsContextValueType);

function ShipsContextProvider({ children }: { children: ReactNode }) {
    const [shipsContext, setShipsContext] = useState([
        {
            id: "CUSTOM",
            cells: [
                { x: 2, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 3 },
                { x: 3, y: 2 },
            ],
            health: 5,
        },
        {
            id: "CUSTOM2",
            cells: [
                { x: 6, y: 0 },
                { x: 6, y: 1 },
                { x: 6, y: 2 },
                { x: 6, y: 3 },
            ],
            health: 5,
        },
    ]);

    return <ShipsContext.Provider value={{ shipsContext, setShipsContext }}>{children}</ShipsContext.Provider>;
}

export { ShipsContextProvider, ShipsContext };
