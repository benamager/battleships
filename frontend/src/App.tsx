import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5600";

export default function App() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    // const [gameState, setGameState] = useState<any | null>(null);

    async function createGame() {
        console.log("create game");

        try {
            const response: AxiosResponse<{ game_id: string }> = await axios.post("http://localhost:5600/create_game", "test");

            // Assuming the response contains the game ID or some other relevant data, set it to state
            if (response.data) {
                setGameId(response.data.game_id);
                joinGameSocket(response.data.game_id);
            }

            console.log(response);
        } catch (error) {
            console.error("Error creating game:", error);
        }
    }

    const [gameIdInput, setGameIdInput] = useState("");
    async function joinGame(gameId: string) {
        console.log("Joining game with id:", gameId);

        try {
            const response: AxiosResponse<{ game_id: string }> = await axios.post("http://localhost:5600/join_game/" + gameId);

            // Assuming the response contains the game ID or some other relevant data, set it to state
            if (response.data) {
                setGameId(response.data.game_id);
                joinGameSocket(response.data.game_id);
            }

            console.log(response);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const newSocket = io("http://localhost:5600");
        setSocket(newSocket);

        // newSocket.on('update_state', (state: any) => {
        //     setGameState(state);
        // });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log(socket);
    }, [socket]);

    function joinGameSocket(gameId: string) {
        console.log("now joining socket");
        if (socket) {
            socket.emit("join_game_ws", { game_id: gameId });
            setGameId(gameId);
        }
    }

    return (
        <div>
            <h1>Active game: {gameId ? gameId : "no game id"}</h1>
            <button
                onClick={() => {
                    void createGame();
                }}
            >
                Create game
            </button>
            <input type="text" value={gameIdInput} onChange={(e) => setGameIdInput(e.target.value)} className="bg-gray-200" />
            <button
                onClick={() => {
                    void joinGame(gameIdInput);
                }}
            >
                Join game
            </button>
        </div>
    );
}
