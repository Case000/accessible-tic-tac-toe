const mysql = require('mysql2');
require('dotenv').config();

// Create the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

// Connect and create the database if it doesn’t exist
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server.');
  
    // Create the database if it doesn't exist
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
      if (err) throw err;
      console.log(`Database "${process.env.DB_NAME}" is ready.`);
  
      // Now connect to the specific database
      db.changeUser({ database: process.env.DB_NAME }, (err) => {
        if (err) throw err;
        console.log(`Connected to "${process.env.DB_NAME}" database.`);
  
        // Create the table if it doesn’t exist
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
  });

module.exports = db;
