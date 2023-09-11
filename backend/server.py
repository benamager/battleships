from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from routes import set_routes

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

print("Server started")

set_routes(app, socketio)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5600)
