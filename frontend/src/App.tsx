import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import GameBoard from "./components/GameBoard";
import { Board, Cell, GameState, PlayerState } from "./types/GameBoard";

const SOCKET_SERVER_URL = "http://localhost:5600";

export default function App() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const initialBoard: Board = Array(10).fill(Array(10).fill("empty" as Cell));

    const initialPlayerState: PlayerState = {
        board: initialBoard,
        hits: 0,
        misses: 0,
    };

    const initialGameState: GameState = {
        player1: { ...initialPlayerState },
        player2: { ...initialPlayerState },
        currentPlayer: null,
        gameStatus: "waiting",
    };

    const [gameState, setGameState] = useState<GameState>(initialGameState);

    console.log(gameState);

    async function createGame() {
        console.log("create game");

        try {
            const response: AxiosResponse<{ game_id: string }> = await axios.post("http://localhost:5600/create_game", "test");

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

    // Update state based on response
    useEffect(() => {
        if (socket) {
            socket.on("player_assignment", (data) => {
                console.log("player_assignment", data);
                setGameState((prevState) => ({ ...prevState, currentPlayer: data }));
            });
        }
    }, [socket]);

    //Update state based on response
    useEffect(() => {
        if (socket) {
            socket.on("update_board", (data) => {
                const { player1, player2 } = data;
                // update gameState for player1 board
                setGameState((prevState) => ({
                    ...prevState,
                    player1: {
                        ...prevState.player1,
                        board: player1,
                    },
                    player2: {
                        ...prevState.player2,
                        board: player2,
                    },
                }));
            });
        }
    }, [socket]);

    function hitCell(row: number, col: number) {
        console.log("hitCell", row, col);
        if (socket) {
            socket.emit("hit_cell", {
                game_id: gameId,
                coordinates: {
                    x: row,
                    y: col,
                },
            });
        }
    }

    return (
        <div className="flex flex-col">
            <h1>
                Active game: {gameId ? gameId : "no game id"} <br />
                Socket connected: {socket?.active ? "true" : "false"} <br /> Player assignment: {gameState.currentPlayer}
            </h1>
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
            <hr />
            <div className="flex gap-4">
                <GameBoard board={gameState.player1.board} hitCell={hitCell} />
                <GameBoard board={gameState.player2.board} hitCell={hitCell} />
            </div>
        </div>
    );
}
