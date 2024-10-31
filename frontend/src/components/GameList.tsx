import React, { useEffect, useState } from "react";
import { getAllGames, createGame } from "../api/gameAPI";

interface GameListProps {
  onSelectGame: (id: string) => void;
}

const GameList: React.FC<GameListProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<any[]>([]);

  const fetchGames = async () => {
    try {
      const gameList = await getAllGames();
      setGames(gameList.reverse()); // Reverse the list to show the newest games first
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreateGame = async () => {
    try {
      const newGame = await createGame();
      setGames([...games, newGame]);
      onSelectGame(newGame.gameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", color: "#333", fontWeight: "bold" }}>
          Game Sessions
        </h2>
        <button
          onClick={fetchGames}
          aria-label="Refresh game list"
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
          onBlur={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
        >
          Refresh
        </button>
      </div>

      <button
        onClick={handleCreateGame}
        aria-label="Create a new game session"
        style={{
          padding: "1rem",
          margin: "1rem 0",
          width: "100%",
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#FFFFFF",
          backgroundColor: "#007BFF",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onBlur={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
      >
        Create New Game
      </button>

      <ul style={{ listStyleType: "none", padding: "0" }}>
        {games.length > 0 ? (
          games.map((game) => (
            <li key={game.gameId} style={{ margin: "1rem 0" }}>
              <button
                onClick={() => onSelectGame(game.gameId)}
                aria-label={`Join Game ${game.gameId}, status is ${game.status}`}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1.1rem",
                  color: "#333",
                  backgroundColor: "#e0e0e0",
                  border: "2px solid #007BFF",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease, transform 0.1s ease",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.backgroundColor = "#c8c8c8")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0e0e0")
                }
              >
                Join Game ID: {game.gameId} - Status: {game.status}
              </button>
            </li>
          ))
        ) : (
          <li
            style={{
              fontSize: "1.25rem",
              color: "#777",
              textAlign: "center",
              padding: "1rem 0",
            }}
          >
            No games available.
          </li>
        )}
      </ul>
    </div>
  );
};

export default GameList;
