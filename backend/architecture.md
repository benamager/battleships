# Backend Architecture Overview



## Quick overview

### WebSocket server

Manage the real-time communication between players. Each player establishes a connection upon joining.



### Room managment

Handle room creation and joining processes and maintain a list of active rooms and their players.



### Game state managment

This is the difficult part. Store current state of each game, such as player turns, ship positions and hit/miss data. Update state based on player actions.



### Client-server communication

Define a protocol for sending and reciving messages as efficient as possible. JSON objects with specific fields for different types of actions.



## Sketching it out

### Room creation

```
function createRoom(playerId):
    roomId = generateUniqueRoomId()
    room = new Room(roomId, playerId)
    addRoomToActiveRooms(room)
    return roomId
```



### Joining a room

```
function joinRoom(playerId, roomId):
    room = findRoomById(roomId)
    if room and room.hasSpace():
        room.addPlayer(playerId)
        return true
    return false
```



### WebSocket connection setup

```
function onWebSocketConnect(socket):
    playerId = identifyPlayer(socket)
    socket.on('joinRoom', (roomId) => handleJoinRoom(playerId, roomId))
    socket.on('makeMove', (move) => handlePlayerMove(playerId, move))
    socket.on('disconnect', () => handleDisconnect(playerId))
```



### Game state update and synchronization

```
function handlePlayerMove(playerId, move):
    game = findGameByPlayerId(playerId)
    if game and game.isPlayersTurn(playerId):
        result = game.makeMove(move)
        broadcastToRoom(game.roomId, result)
```



### Data structures

#### Room

roomId, players[], gameState

#### Game state

​    Attributes: playerTurn, shipPositions, hitMissData
​    Methods: makeMove(move), checkWinCondition()



### Handling client actions

#### Player move

​    Validate move
​    Update game state
​    Broadcast updated state to all players in the room

#### Joining/leaving rooms:

​    Add/remove players from rooms
​    Handle game start when room is full

#### Win/loss detection

​    Check win conditions after each move
​    Broadcast win/loss message and end game if conditions are met