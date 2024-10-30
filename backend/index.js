const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const gameRoutes = require('./routes/gameRoutes');

// Initialize Express app
const app = express();
// Initialise Database on start-up
const db = require('./database/db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', gameRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
