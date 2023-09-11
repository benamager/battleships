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