// routes/gameRoutes.js
const express = require('express');
const gameController = require('../controllers/gameController.js');

const router = express.Router();

router.get('/games', gameController.getAllGames);
router.post('/newgame', gameController.createGame);
router.get('/games/:gameId', gameController.getGame);
router.post('/games/:gameId/join', gameController.joinGame);
router.post('/games/:gameId/move', gameController.makeMove);

module.exports = router;
