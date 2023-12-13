import "@/styles/app.scss";
import Game from "@/components/Game";
import { ShipsContextProvider } from "@/contexts/ShipsContext";
import { MapContextProvider } from "@/contexts/MapContext";

export default function App() {
    return (
        <MapContextProvider>
            <ShipsContextProvider>
                <Game />
            </ShipsContextProvider>
        </MapContextProvider>
    );
}
