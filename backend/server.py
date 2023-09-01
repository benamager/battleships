from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import uuid

import random
import string

def generate_short_id(length=5):
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for i in range(length))


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

print("Server started")

# Games" data storage: game_id => game_state
games = {}

# Endpoint to create a new game
@app.route("/create_game", methods=["POST"])
def create_game():
    game_id = str(generate_short_id())
    games[game_id] = {"state": "initial_state"} # This can be any initial game state
    return jsonify({"game_id": game_id})

# Endpoint to join an existing game by ID
@app.route("/join_game/<game_id>", methods=["POST"])
def join_game(game_id):
    if game_id not in games:
        return jsonify({"error": "Game not found"}), 404

    # Normally, you"d want to ensure only 2 players can join, handle that logic here
    return jsonify({"game_id": game_id})

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("join_game_ws")
def handle_join_game_ws(data):
    game_id = data["game_id"]
    join_room(game_id)
    emit("update_state", games[game_id]["state"], room=game_id)

@socketio.on("update_game")
def handle_update_game(data):
    game_id = data["game_id"]
    state = data["state"]
    games[game_id]["state"] = state
    emit("update_state", state, room=game_id)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5600)
