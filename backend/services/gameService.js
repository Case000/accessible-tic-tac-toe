const db = require('../database/db')

// Get all games from the database
exports.getAllGames = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM games', (err, results) => {
      if (err) {
        return reject(err); // Reject the promise if there's an error
      }
      // Parse JSON fields for each game entry
      const games = results.map((game) => ({
        gameId: game.gameId,
        status: game.status,
        currentPlayer: game.currentPlayer,
        board: JSON.parse(game.board), // Parse JSON field for board
        moves: JSON.parse(game.moves)   // Parse JSON field for moves
      }));  
      resolve(games);
    });
  });
};

exports.createGame = () => {
  const newGame = {
    board: JSON.stringify(Array(3).fill(null).map(() => Array(3).fill(null))),
    currentPlayer: 'X',
    status: 'ongoing',
    moves: JSON.stringify([]),
  };

  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO games (board, currentPlayer, status, moves) VALUES (?, ?, ?, ?)',
      [newGame.board, newGame.currentPlayer, newGame.status, newGame.moves],
      (err, results) => {
        if (err) return reject(err);
        resolve({ gameId: results.insertId, ...newGame });
      }
    );
  });
};

exports.getGameById = (gameId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM games WHERE gameId = ?', [gameId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        console.log(`No game found with ID ${gameId}`);
        return resolve(null);
      }
      const game = results[0];
      game.board = JSON.parse(game.board);
      game.moves = JSON.parse(game.moves);
      resolve(game);
    });
  });
};

exports.joinGame = (gameId, playerId) => {
  return new Promise((resolve, reject) => {
    // Fetch the game to check existing players
    db.query('SELECT * FROM games WHERE gameId = ?', [gameId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve({ error: 'Game not found' });

      const game = results[0];

      // If the game is ongoing and both player slots are filled by other players, reject join
      if (game.status === 'ongoing' && game.playerX && game.playerO && 
          game.playerX !== playerId && game.playerO !== playerId) {
        return resolve({ error: 'Game is already full and ongoing.' });
      }

      // Check if the player is already in the game
      let role;
      if (game.playerX === playerId) {
        role = 'X'; // Player is already assigned as X
      } else if (game.playerO === playerId) {
        role = 'O'; // Player is already assigned as O
      } else if (!game.playerX) {
        // If no playerX, assign this player as X
        role = 'X';
        game.playerX = playerId;
      } else if (!game.playerO) {
        // If no playerO, assign this player as O
        role = 'O';
        game.playerO = playerId;
      } else {
        return resolve({ error: 'Game is already full' }); // Game is full and player is not recognized
      }

      // Update the game record only if a new player was added
      if (role === 'X' && game.playerX === playerId || role === 'O' && game.playerO === playerId) {
        db.query('UPDATE games SET playerX = ?, playerO = ? WHERE gameId = ?', [game.playerX, game.playerO, gameId], (err) => {
          if (err) return reject(err);
          resolve({ role, gameId, status: game.status });
        });
      } else {
        // If no new player was added, just return the role
        resolve({ role, gameId, status: game.status });
      }
    });
  });
};



exports.makeMove = (gameId, player, row, col) => {
  return new Promise((resolve, reject) => {
    exports.getGameById(gameId).then((game) => {
      if (game.status !== 'ongoing') throw new Error('Game over');
      if (game.board[row][col] !== null) throw new Error('Invalid move');

      game.board[row][col] = player;
      game.moves.push({ player, row, col });
      game.currentPlayer = player === 'X' ? 'O' : 'X';

      // Update status if there's a win or tie
      if (checkWin(game.board, player)) {
        game.status = `${player} wins`;
      } else if (game.moves.length === 9) {
        game.status = 'tie';
      }

      db.query(
        'UPDATE games SET board = ?, currentPlayer = ?, status = ?, moves = ? WHERE gameId = ?',
        [JSON.stringify(game.board), game.currentPlayer, game.status, JSON.stringify(game.moves), gameId],
        (err) => {
          if (err) return reject(err);
          resolve(game);
        }
      );
    }).catch(reject);
  });
};

// Check win logic
function checkWin(board, player) {
  // Implement logic for rows, columns, and diagonals win conditions
  return (
    board.some(row => row.every(cell => cell === player)) ||
    board[0].some((_, col) => board.every(row => row[col] === player)) ||
    board.every((row, idx) => row[idx] === player) ||
    board.every((row, idx) => row[2 - idx] === player)
  );
}
