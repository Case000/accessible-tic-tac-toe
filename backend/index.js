const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const gameRoutes = require('./routes/gameRoutes');
require('dotenv').config();

const app = express();
const db = require('./database/db');

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', gameRoutes);

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

app.listen(new URL(SERVER_URL).port, () => {
  console.log(`Server is running on ${SERVER_URL}`);
});
