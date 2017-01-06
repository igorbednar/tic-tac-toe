class Game {

    constructor(player1, player2) {
        this.board = ['*', '*', '*', '*', '*', '*', '*', '*', '*']
        this.players = [{ info: player1, sign: null }, { info: player2, sign: null }];

        let startingPlayer = Math.floor(Math.random() * (2));
        this.players[startingPlayer].sign = 'x';
        this.players[(startingPlayer + 1) % 2].sign = 'o';

        this.currentPlayerIndex = this.players[0].sign === 'x' ? 0 : 1;
        this.gameEnded = false;
    }

    get gameStats() {
        return {
            players: this.players
        };
    }

    makeMove(playerId, cellIndex) {

        if (this.gameEnded)
            return { result: 'IncorrectMove' };

        let player = this.players[this.currentPlayerIndex];

        if (player.info.id !== playerId)
            return { result: 'IncorrectMove' };

        if (cellIndex < 0 || cellIndex >= this.board.length)
            return { result: 'IncorrectMove' };

        if (this.board[cellIndex] != '*')
            return { result: 'IncorrectMove' };

        this.board[cellIndex] = player.sign;

        if (this.checkWin()) {
            this.gameEnded = true;
            return { result: 'Win', index: cellIndex, player: player };
        }

        if (this.checkDraw()) {
            this.gameEnded = true;
            return { result: 'Draw', index: cellIndex, player: player }
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;

        return { result: 'Move', index: cellIndex, player: player };
    }

    checkWin() {
        let wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < wins.length; i++) {
            const [a, b, c] = wins[i];
            if (this.board[a] != '*' && this.board[a] === this.board[b] &&
                this.board[b] === this.board[c]) {
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '*')
                return false;
        }
        return true;
    }
}

module.exports = Game;