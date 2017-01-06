var socket = null;


function onLoad() {

    var playerName = prompt("Please enter your name", "Anonymous");
    playerName = playerName != null ? playerName : "Anonymous";
    startGame(playerName);
}

function startGame(playerName) {

    socket = io.connect('http://localhost:3000');

    socket.on('connect', function () {
        console.log('my id is:' + socket.id);
        socket.emit('join_room', { name: playerName });
    });

    socket.on('other_side_disconnected', function () {
        console.log('other_side_disconnected');
        alert("Other side disconnected");

        for (let i = 0; i < 9; i++) {
            updateCell(i, "&nbsp");
        }

        updatePlayers("", "");
        updateCurrentMove("");
        updateMessage("");

        socket.emit('join_room', { name: playerName });
    });

    socket.on('game_started', function (data) {
        console.log(data);

        updatePlayers(data.players[0].info.name + ' ' + data.players[0].sign.toUpperCase(),
            data.players[1].info.name + ' ' + data.players[1].sign.toUpperCase())
        updateCurrentMove("X");

    });

    socket.on('room_joined', function (data) {
        console.log(data);
        updatePlayers(data.name, "");
    });

    socket.on('game_updated', function (data) {
        console.log(data);
        updateCell(data.index, data.player.sign);
        if (data.status === 'Win') {
            updateMessage("Player " + data.player.info.name + " won");
        }
        else if (data.status === 'Draw') {
            updateMessage("Draw");
        }
        else {
            updateCurrentMove(data.player.sign === 'x' ? 'O' : 'X');
        }

    });
}

function makeMove(index) {
    if (socket != null)
        socket.emit('make_move', { index: index });
}

function updateHtml(id, data) {

    var cell = document.getElementById(id);
    if (cell != null) {
        cell.innerHTML = data;
    }
}

function updateCell(index, data) {
    updateHtml("cell" + index, data);
}

function updateCurrentMove(sign) {
    updateHtml("current-move", sign);
}

function updatePlayers(player1, player2) {
    updateHtml("player1", player1);
    updateHtml("player2", player2);
}

function updateMessage(message) {
    updateHtml("message-box", message);
}
