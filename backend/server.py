class Cell:
    EMPTY = "empty"
    SHIP = "ship"
    HIT = "hit"
    MISS = "miss"

class Player:
    def __init__(self):
        self.board = [[Cell.EMPTY for _ in range(10)] for _ in range(10)]
        self.ships = []
        self.hits = []
        self.misses = []
        self.ready = False
        self.player_id = None

class Game:
    def __init__(self):
        self.player1 = Player()
        self.player2 = Player()
        self.state = "waiting"


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
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

print("Server started")

games = {}  # This remains the same

@app.route("/create_game", methods=["POST"])
def create_game():
    game_id = str(generate_short_id())
    games[game_id] = Game()  # Create a new Game object
    print("Created game with ID:", game_id)
    return jsonify({"game_id": game_id})

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
    
    if game_id not in games:
        emit("error", {"error": "Invalid game ID."})
        return

    current_game = games[game_id]
    current_player = None
    if not current_game.player1.player_id:
        current_game.player1.player_id = request.sid
        current_player = "player1"
    elif not current_game.player2.player_id:
        current_game.player2.player_id = request.sid
        current_player = "player2"
    else:
        emit("error", {"error": "Game room is full."})
        return

    join_room(game_id)
    emit("player_assignment", current_player)
    emit("update_board", current_game.player1.board)  # TODO: Adjust this based on your game logic

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
    # Will probably send just the cell coordinates and result to the client to save bandwidth
    #emit("hit_result", {"player": player, "coordinates": (x, y), "result": result}, room=game_id)

    # send player 1 board to both players
    emit("update_board", games[game_id]["player1"]["board"], room=game_id)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5600)