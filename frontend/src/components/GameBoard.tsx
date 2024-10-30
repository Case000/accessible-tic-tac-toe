import React, { useState, useEffect, useRef } from 'react';
import { makeMove, getGame } from '../api/gameAPI';
import { joinGameHelper } from '../middleware/joinGame';

interface GameBoardProps {
  gameId: string;
  board: string[][];
  currentPlayer: string;
  onUpdate: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId, board, currentPlayer, onUpdate }) => {
  const [playerRole, setPlayerRole] = useState<string | null>(null); // "X" or "O"
  const [gameStatus, setGameStatus] = useState<string | null>(null); // "X wins", "O wins", "tie"
  const joinedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to play audio feedback

  // Generate or retrieve player ID
  const [playerId] = useState<string>(() => {
    let storedPlayerId = localStorage.getItem('playerId');
    if (!storedPlayerId) {
      storedPlayerId = `player-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('playerId', storedPlayerId);
    }
    return storedPlayerId;
  });

  const joinCurrentGame = async () => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    const role = await joinGameHelper(gameId, playerId);
    if (role) {
      setPlayerRole(role);
    } else {
      joinedRef.current = false;
    }
  };

  useEffect(() => {
    if (!playerRole) {
      joinCurrentGame();
    }
  }, [gameId, playerRole]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const updatedGame = await getGame(gameId);
      
      if (updatedGame) {
        // Update the game status if it has changed
        if (updatedGame.status !== gameStatus) {
          setGameStatus(updatedGame.status);
        } 
        // Trigger onUpdate if the board has changed
        if (JSON.stringify(updatedGame.board) !== JSON.stringify(board)) {
          onUpdate();
        }  
        // Stop polling if the game has ended
        if (updatedGame.status !== 'ongoing') {
          clearInterval(intervalId);
          console.log("Polling stopped as the game has ended with status:", updatedGame.status);
        }
      }
    }, 3000);
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [gameId, board, gameStatus, onUpdate]);

  useEffect(() => {
    // Play sound and announce winner or tie when game ends
    if (gameStatus && gameStatus !== 'ongoing') {
      if (gameStatus === `${playerRole} wins`) {
        audioRef.current = new Audio('/audio/win.mp3');
        audioRef.current.play();
      } else if (gameStatus === 'tie') {
        audioRef.current = new Audio('/audio/tie.mp3');
        audioRef.current.play();
      } else {
        audioRef.current = new Audio('/audio/lose.mp3');
        audioRef.current.play();
      }
    }
  }, [gameStatus, playerRole]);

  const handleCellClick = async (row: number, col: number) => {
    if (playerRole !== currentPlayer) {
      alert("It's not your turn!");
      return;
    }
    try {
      await makeMove(gameId, playerRole!, row, col);
      onUpdate();
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      {/* Game result announcement */}
      {gameStatus && gameStatus !== 'ongoing' && (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        padding: '1rem',
        fontSize: '1.5rem',
        color: gameStatus === `${playerRole} wins` 
          ? '#28a745' 
          : gameStatus === 'tie' 
          ? '#ffc107' 
          : '#dc3545',
        backgroundColor: gameStatus === `${playerRole} wins` 
          ? '#d4edda' 
          : gameStatus === 'tie' 
          ? '#fff3cd' 
          : '#f8d7da',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}          
    >
      {gameStatus === `${playerRole} wins` && "Congratulations! You win!"}
      {gameStatus === 'tie' && "It's a tie!"}
      {gameStatus === `${playerRole === 'X' ? 'O wins' : 'X wins'}` && "You lose. Better luck next time!"}
    </div>
)}
  
      {/* Turn indicator */}
      {(!gameStatus || gameStatus === 'ongoing') && (
        <>
          <h2 style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>
            You are playing as <span style={{ color: playerRole === 'X' ? '#FF6347' : '#4682B4' }}>{playerRole}</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            {playerRole === currentPlayer ? "It's your turn!" : "Waiting for your opponent..."}
          </p>
        </>
      )}
  
      {/* Game board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 80px)',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '1rem',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #007BFF',
                borderRadius: '8px',
                backgroundColor: cell ? (cell === 'X' ? '#FF6347' : '#4682B4') : '#e0e0e0',
                color: '#FFF',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = '#333')}
              onBlur={(e) => (e.currentTarget.style.backgroundColor = cell ? (cell === 'X' ? '#FF6347' : '#4682B4') : '#e0e0e0')}
            >
              {cell || ''}
            </button>
          ))
        )}
      </div>
    </div>
  );
  
};

export default GameBoard;
