from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import uuid

import random
import string

# Creates the game ID
def generate_short_id(length=5):
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for i in range(length))


# Function to generate the board, which is a 10x10 grid of cells
# Each cell is represented by a string, which can be one of the following:
# -  'empty' = an empty cell.
# -  'ship' = cell occupied by a ship.
# -  'hit' = cell that's has been attacked and hit.
# -  'miss' = cell that's has been attacked but missed.
def generate_board():
    # A 10x10 board represented by a 2D array of strings
    board = [['empty' for _ in range(10)] for _ in range(10)]
    return board


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

print("Server started")

# Games" data storage: game_id => game_state
games = {}

# Endpoint to create a new game
@app.route("/create_game", methods=["POST"])
def create_game():
    game_id = str(generate_short_id()) # Generate a random game ID

    # Set the initial state of the game in the games dictionary
    games[game_id] = {
      "player1": {
        "board": generate_board(),
        "ships": [], # For faster lookup
        "hits": [],
        "misses": [], 
        "ready": False
      },
      "player2": {
        "board": generate_board(),
        "ships": [],
        "hits": [],
        "misses": [],
        "ready": False
      },
      "state": "waiting" # Possible states: waiting, placing, playing, finished
    }

    print("Created game with ID:", game_id)
    return jsonify({"game_id": game_id}) # Return the game ID to client to join

# Endpoint to join an existing game by ID
@app.route("/join_game/<game_id>", methods=["POST"])
def join_game(game_id):
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404

    # TODO: Add logic to check if the game is already full
    return jsonify({"game_id": game_id})

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("join_game_ws")
def handle_join_game_ws(data):
    game_id = data["game_id"]
    
    # Check if game_id is valid
    if game_id not in games:
        emit("error", {"error": "Invalid game ID."})
        return

    # Assign player based on the current state of the game
    if not games[game_id]["player1"].get("player_id"):
        games[game_id]["player1"]["player_id"] = request.sid  # Assigning the current Socket.IO session ID as the player ID
        current_player = "player1"
    elif not games[game_id]["player2"].get("player_id"):
        games[game_id]["player2"]["player_id"] = request.sid
        current_player = "player2"
    else:
        # Both player spots are occupied
        emit("error", {"error": "Game room is full."})
        return

    join_room(game_id)
    emit("player_assignment", current_player)  # Informing the client of their player designation (either player1 or player2)
    # TODO: not always send player1's board
    emit("update_board", games[game_id]["player1"]["board"]) # Send the board to the client


@socketio.on("hit_cell")
def handle_hit_cell(data):
    game_id = data["game_id"]
    player = "player1" if request.sid == games[game_id]["player1"]["player_id"] else "player2" # Determine which player sent the hit request
    x, y = data["coordinates"]["x"], data["coordinates"]["y"]

    print("Player", player, "hit cell", x, y)

    # Retrieve opponent
    if player == "player1":
        opponent = "player2"
    else:
        opponent = "player1"
    
    # TODO: remove this which always hits player1 board
    opponent = "player1"

    # Check the opponent's board at the given cell coordinates
    cell_value = games[game_id][opponent]["board"][x][y]
    if cell_value == "ship":
        print("Hit!")
        games[game_id][opponent]["board"][x][y] = "hit"
        games[game_id][opponent]["hits"].append((x, y))
        result = "hit"
    else:
        print("Missed!")
        games[game_id][opponent]["board"][x][y] = "miss"
        games[game_id][opponent]["misses"].append((x, y))
        result = "miss"

    # Notify players of the hit result
    # Will probably send just the cell coordinates and result to the client
    #emit("hit_result", {"player": player, "coordinates": (x, y), "result": result}, room=game_id)

    # send player 1 board to both players
    emit("update_board", games[game_id]["player1"]["board"], room=game_id)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5600)
