import React from 'react';

interface GameStatusProps {
  currentPlayer: string;
  status: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ currentPlayer, status }) => {
  return (
    <div>
      <h3>Game Status</h3>
      <p>{status === 'ongoing' ? `Current Player: ${currentPlayer}` : `Status: ${status}`}</p>
    </div>
  );
};

export default GameStatus;
