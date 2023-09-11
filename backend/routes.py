from flask import jsonify, request
from flask_socketio import emit, join_room

from models import Game
from utils import generate_short_id, generate_board

games = {}  # This remains the same

def set_routes(app, socketio):

    @app.route("/create_game", methods=["POST"])
    def create_game():
        game_id = str(generate_short_id())
        games[game_id] = Game()  # Create a new Game object
        print("Created game with ID:", game_id)
        return jsonify({"game_id": game_id})

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

    @socketio.on("hit_cell")
    def handle_hit_cell(data):
        game_id = data["game_id"]
        current_game = games[game_id]
        
        player = "player1" if request.sid == current_game.get_player("player1").player_id else "player2"
        x, y = data["coordinates"]["x"], data["coordinates"]["y"]

        print("Player", player, "hit cell", x, y)

        # Retrieve opponent
        opponent = "player2" if player == "player1" else "player1"

        # Check the opponent's board at the given cell coordinates
        cell_value = current_game.get_player(opponent).board[x][y]
        
        if cell_value == "ship":
            print("Hit!")
            current_game.get_player(opponent).board[x][y] = "hit"
            current_game.get_player(opponent).hits.append((x, y))
            result = "hit"
        else:
            print("Missed!")
            current_game.get_player(opponent).board[x][y] = "miss"
            current_game.get_player(opponent).misses.append((x, y))
            result = "miss"

        # Prepare the boards for sending to the client
        update_board = {
            "player1": current_game.get_player("player1").board,
            "player2": current_game.get_player("player2").board
        }
        
        emit("update_board", update_board, room=game_id)
