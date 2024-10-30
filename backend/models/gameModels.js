// models/game.js
let gameIdCounter = 1;
const games = {};

class Game {
  constructor() {
    this.id = gameIdCounter++;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.status = 'ongoing';
    this.moves = [];
    games[this.id] = this;
  }

  static findById(id) {
    return games[id];
  }

  static findAll() {
    return Object.values(games);
  }

  makeMove(player, position) {
    if (this.board[position] === null && this.currentPlayer === player) {
      this.board[position] = player;
      this.moves.push({ player, position });
      this.currentPlayer = player === 'X' ? 'O' : 'X';
      if (checkWin(this.board)) this.status = `${player} wins`;
      if (this.moves.length === 9 && this.status === 'ongoing') this.status = 'tie';
    }
  }
}

module.exports = { Game };
