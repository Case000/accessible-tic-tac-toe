import React, { useState } from 'react';
import GameList from './components/GameList';
import GameBoard from './components/GameBoard';
import { getGame } from './api/gameAPI';

const App: React.FC = () => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null); // Track selected game ID
  const [gameData, setGameData] = useState<any>(null); // Track the selected game data

  const handleSelectGame = async (gameId: string) => {
    setActiveGameId(gameId);
    const game = await getGame(gameId); // Fetch game data from backend
    setGameData(game); // Set game data in state
  };

  const handleBackToSessions = () => {
    setActiveGameId(null); // Clear active game
    setGameData(null); // Clear game data
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      {/* Game Name Header */}
      <header>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#007BFF',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
          aria-label="Accessible Tic-Tac-Toe Game"
        >
          Accessible Tic-Tac-Toe
        </h1>
      </header>

      {activeGameId && gameData ? (
        // Show GameBoard when a game is active
        <div>
          <button
            onClick={handleBackToSessions}
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#FFFFFF',
              backgroundColor: '#007BFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
          >
            Back to Game Sessions
          </button>
          <GameBoard gameId={activeGameId} board={gameData.board} currentPlayer={gameData.currentPlayer} onUpdate={() => handleSelectGame(activeGameId)} />
        </div>
      ) : (
        // Show GameList when no game is active
        <GameList onSelectGame={handleSelectGame} />
      )}
    </div>
  );
};

export default App;
