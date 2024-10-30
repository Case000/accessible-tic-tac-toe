const { createGame, makeMove, getGameById, getAllGames, joinGame } = require('../services/gameService');

// List all games
exports.getAllGames = async (req, res) => {
  try {
    const games = await getAllGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving all games.' });
  }
};

// Create a new game session
exports.createGame = async (req, res) => {
  try {
    const newGame = await createGame();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new game session.' });
  }
};

// Retrieve a specific game by ID
exports.getGame = async (req, res) => {
  const { gameId } = req.params;
  try {
    const game = await getGameById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the game.' });
  }
};
// Join a specific game by gameId with playerId
exports.joinGame = async (req, res) => {
  const { gameId } = req.params;
  const { playerId } = req.body;
  try {
    const result = await joinGame(gameId, playerId);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'An error occurred while joining the game.' });
  }
};


// Make a move in an existing game
exports.makeMove = async (req, res) => {
  const { gameId } = req.params;
  const { player, row, col } = req.body;

  try {
    const game = await makeMove(gameId, player, row, col);
    res.status(200).json(game);
  } catch (error) {
    if (error.message === 'Game not found') {
      res.status(404).json({ error: 'Game not found.' });
    } else if (error.message === 'Invalid move') {
      res.status(400).json({ error: 'Invalid move. Cell is occupied or out of bounds.' });
    } else if (error.message === 'Game over') {
      res.status(400).json({ error: 'Game has already ended.' });
    } else {
      res.status(500).json({ error: 'An error occurred while making the move.' });
    }
  }
};