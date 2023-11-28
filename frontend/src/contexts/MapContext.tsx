import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { maps } from "@/constants/Maps";

export type MapType = string[][];

const MapContextDefaultValue = {
    mapContext: maps[0],
    setMapContext: () => {},
};

const MapContext = createContext<{
    mapContext: MapType;
    setMapContext: Dispatch<SetStateAction<MapType>>;
}>(MapContextDefaultValue);

function MapContextProvider({ children }: { children: ReactNode }) {
    // Randomly select a map from the preset maps
    const [mapContext, setMapContext] = useState<MapType>(maps[Math.floor(Math.random() * maps.length)]);

    return <MapContext.Provider value={{ mapContext, setMapContext }}>{children}</MapContext.Provider>;
}

export { MapContextProvider, MapContext };
