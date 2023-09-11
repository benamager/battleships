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

    def get_player(self, player_id):
        """Retrieve the player instance based on the player_id."""
        if player_id == "player1":
            return self.player1
        elif player_id == "player2":
            return self.player2
        else:
            raise ValueError(f"Invalid player_id: {player_id}")