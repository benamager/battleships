import React, { createContext, useState } from "react";

// Define the shape of your dragging state
interface DraggingState {
    shipId: string | null;
    initialX: number | null;
    initialY: number | null;
}

// Define the context type
interface DraggingContextType {
    dragging: DraggingState;
    setDragging: React.Dispatch<React.SetStateAction<DraggingState>>;
}

// Create a context with an empty object and cast it to the context type
const DraggingContext = createContext<DraggingContextType>({} as DraggingContextType);

// Define the props for the provider
interface DraggingProviderProps {
    children: React.ReactNode;
}

const DraggingProvider: React.FunctionComponent<DraggingProviderProps> = ({ children }) => {
    const [dragging, setDragging] = useState<DraggingState>({
        shipId: null,
        initialX: null,
        initialY: null,
    });

    return <DraggingContext.Provider value={{ dragging, setDragging }}>{children}</DraggingContext.Provider>;
};

export { DraggingContext, DraggingProvider };
