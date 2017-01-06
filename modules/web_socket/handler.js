
var game = require('../game_engine/game.js');
var waitingRoom = false;
var currentRoom = null;
var rooms = {};
var index = 1;

var handler = (io, socket) => {

  console.log(socket.id + ' connected');

  socket.on('join_room', function (data) {
    console.log(socket.id + ' joining room');

    var player = { name: data.name, id: socket.id }

    if (waitingRoom) {
      currentRoom.player2 = player;
    }
    else {
      currentRoom = { id: 'room_' + index++, player1: player, player2: null, game: null };
    }

    waitingRoom = !waitingRoom;
    rooms[socket.id] = currentRoom;
    socket.join(currentRoom.id)

    if (currentRoom.player2 != null) {
      //starting a game;
      currentRoom.game = new game(currentRoom.player1, currentRoom.player2);
      io.to(currentRoom.id).emit('game_started', currentRoom.game.gameStats);
    }
    else {

      io.to(currentRoom.id).emit('room_joined', {
        name: data.name
      });
    }

  });

  socket.on('make_move', function (data) {
    console.log(socket.id + ' made move: ' + data.index);

    if (!rooms[socket.id])
      return;

    let room = rooms[socket.id];

    if (room.player2 == null)
      return;

    var moveResult = room.game.makeMove(socket.id, data.index);
    if (moveResult.result != 'IncorrectMove') {
      io.to(currentRoom.id).emit('game_updated', {
        status: moveResult.result,
        index: moveResult.index,
        player: moveResult.player
      });
    }

  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' Got disconnected!');

    if (!rooms[socket.id])
      return;

    let room = rooms[socket.id];
    delete rooms[socket.id];

    if (room.player2 == null) {
      waitingRoom = false;

    }
    else {
      let other = room.player1.id === socket.id ? room.player2.id : room.player1.id;
      delete rooms[other];
      socket.broadcast.to(other).emit('other_side_disconnected');
    }

  });
}

module.exports = { handle: handler };