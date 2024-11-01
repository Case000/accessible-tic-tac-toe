const mysql = require('mysql2');
require('dotenv').config();

const MAX_RETRIES = 10; // Number of retry attempts
const RETRY_DELAY = 2000; // Delay in milliseconds between retries

let retries = 0;

// Function to attempt database connection
function connectWithRetry() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'game_db'
  });

  db.connect((err) => {
    if (err) {
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Database connection failed. Retrying (${retries}/${MAX_RETRIES})...`);
        setTimeout(connectWithRetry, RETRY_DELAY); // Retry after delay
      } else {
        console.error('Max retries reached. Could not connect to the database.');
        process.exit(1); // Exit process if unable to connect
      }
    } else {
      console.log('Connected to MySQL server.');

      // Run initial setup if necessary
      db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) throw err;
        console.log(`Database "${process.env.DB_NAME}" is ready.`);

        // Select the specific database and create tables if needed
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
          if (err) throw err;
          console.log(`Connected to "${process.env.DB_NAME}" database.`);

          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS games (
              gameId INT AUTO_INCREMENT PRIMARY KEY,
              board TEXT NOT NULL,
              currentPlayer VARCHAR(1) NOT NULL,
              status VARCHAR(20) DEFAULT 'ongoing',
              moves TEXT,
              playerX VARCHAR(255),
              playerO VARCHAR(255)
            );
          `;

          db.query(createTableQuery, (err) => {
            if (err) throw err;
            console.log('Games table is ready.');
          });
        });
      });
    }
  });

  return db;
}

const db = connectWithRetry();

module.exports = db;
