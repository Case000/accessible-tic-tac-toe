const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Accessible Tic-Tac-Toe API');
});

//Routes for game session endpoints
app.post('/games', (req, res) => {
    res.send('Game session created');
});
app.post('/games/:id/move', (req, res) => {
    res.send(`Move made in game ${req.params.id}`);
});
app.get('/games/:id', (req, res) => {
    res.send(`Game session ${req.params.id} details`);
});
app.get('/games', (req, res) => {
    res.send('List of game sessions');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
