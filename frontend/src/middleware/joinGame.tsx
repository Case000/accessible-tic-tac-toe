// src/middleware/joinGame.tsx

import { joinGame as apiJoinGame } from '../api/gameAPI';

export const joinGameHelper = async (gameId: string, playerId: string): Promise<string | null> => {
  try {
    const result = await apiJoinGame(gameId, playerId);
    if (result.error) {
      if (result.error === 'Game is already full') {
        alert('The game is already full. You cannot join this game.'); // Display alert if game is full
      } else {
        alert(result.error); // Display any other errors
      }
      localStorage.removeItem('gameId');
      localStorage.removeItem('playerId');
      return null;
    } else {
      localStorage.setItem('gameId', gameId); // Save gameId in localStorage
      return result.role; // Return the player's assigned role ("X" or "O")
    }
  } catch (error) {
    console.error('Error joining game:', error);
    return null;
  }
};
