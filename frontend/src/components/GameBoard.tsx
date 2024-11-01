import React, { useState, useEffect, useRef } from "react";
import { makeMove, getGame } from "../api/gameAPI";
import { joinGameHelper } from "../middleware/joinGame";
import "../App.css";

interface GameBoardProps {
  gameId: string;
  board: string[][];
  currentPlayer: string;
  onUpdate: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameId,
  board,
  currentPlayer,
  onUpdate,
}) => {
  const [playerRole, setPlayerRole] = useState<string | null>(null); // "X" or "O"
  const [gameStatus, setGameStatus] = useState<string | null>(null); // "X wins", "O wins", "tie"
  const joinedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to play audio feedback
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const announceTimeout = useRef<number | null>(null);
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [previousBoard, setPreviousBoard] = useState<string[][]>(board);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Generate or retrieve player ID
  const [playerId] = useState<string>(() => {
    let storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      storedPlayerId = `player-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("playerId", storedPlayerId);
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
  //When the current player make a move
  const handleCellClick = async (row: number, col: number) => {
    if (playerRole !== currentPlayer) {
      alert("It's not your turn!");
      return;
    }
    try {
      await makeMove(gameId, playerRole!, row, col);
      setLastMove(`Row ${row + 1}, Column ${col + 1}`);
      setAnnouncement(
        `You selected Row ${row + 1}, Column ${
          col + 1
        }. Waiting for your opponent...`
      );
      setPreviousBoard((prevBoard) => {
        const updatedBoard = [...prevBoard];
        updatedBoard[row][col] = playerRole!;
        return updatedBoard;
      });
      onUpdate();
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const findLastMove = (prevBoard: string[][], currentBoard: string[][]) => {
    for (let row = 0; row < currentBoard.length; row++) {
      for (let col = 0; col < currentBoard[row].length; col++) {
        if (prevBoard[row][col] !== currentBoard[row][col]) {
          return {
            move: `Row ${row + 1}, Column ${col + 1}`,
            player: currentBoard[row][col],
          };
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const updatedGame = await getGame(gameId);

      if (updatedGame) {
        // Update the game status if it has changed
        if (updatedGame.status !== gameStatus) {
          setGameStatus(updatedGame.status);
        }
        // Trigger onUpdate if the board has changed (Opponent makes a move)
        if (JSON.stringify(updatedGame.board) !== JSON.stringify(board)) {
          // Find and set the last move
          const detectedMove = findLastMove(previousBoard, updatedGame.board);
          if (detectedMove && detectedMove.player !== playerRole) {
            setLastMove(detectedMove.move);
            // Set announcement based on the Opp last move
            setAnnouncement(
              `Your opponent selected ${detectedMove.move}. It's your turn!`
            );
          }
          onUpdate();
          setPreviousBoard(updatedGame.board);
        }
        // Stop polling if the game has ended
        if (updatedGame.status !== "ongoing") {
          clearInterval(intervalId);
          console.log(
            "Polling stopped as the game has ended with status:",
            updatedGame.status
          );
        }
      }
    }, 3000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [gameId, board, gameStatus, onUpdate]);

  useEffect(() => {
    // Play sound and announce winner or tie when game ends
    if (gameStatus && gameStatus !== "ongoing") {
      if (gameStatus === `${playerRole} wins`) {
        audioRef.current = new Audio("/audio/win.mp3");
        audioRef.current.play();
      } else if (gameStatus === "tie") {
        audioRef.current = new Audio("/audio/tie.mp3");
        audioRef.current.play();
      } else {
        audioRef.current = new Audio("/audio/lose.mp3");
        audioRef.current.play();
      }
    }
  }, [gameStatus, playerRole]);

  const updateSelectedCell = (
    rowIndex: number,
    colIndex: number,
    cell: string | null
  ) => {
    // Clear any existing timeouts to prevent stacking
    if (announceTimeout.current) clearTimeout(announceTimeout.current);
    const cellState = cell
      ? cell === "X"
        ? "Occupied by X"
        : "Occupied by O"
      : "Empty";
    setSelectedCell(
      `Row ${rowIndex + 1}, Column ${colIndex + 1}, ${cellState}`
    );
    announceTimeout.current = window.setTimeout(() => {
      setSelectedCell(null); // Clear the announcement after a delay
    }, 500); // Adjust delay as needed
  };
  useEffect(() => {
    return () => {
      if (announceTimeout.current) clearTimeout(announceTimeout.current); // Clean up on unmount
    };
  }, []);

  return (
    <div
      className="game-board-container"
      aria-label="Tic-Tac-Toe game board. The grid is a 3x3 layout with rows and columns. You are playing as X or O based on your role."
    >
      <p
        tabIndex={0}
        style={{ fontSize: "1rem", color: "#555", marginBottom: "1rem" }}
      >
        This is a 3x3 grid layout. Select an empty cell to make your move. Rows
        and columns are numbered from top to bottom and left to right.
      </p>
      {/* Game result announcement */}
      {gameStatus && gameStatus !== "ongoing" && (
        <div
          role="alert"
          aria-live="assertive"
          className={`alert-container ${
            gameStatus === `${playerRole} wins`
              ? "alert-win"
              : gameStatus === "tie"
              ? "alert-tie"
              : "alert-lose"
          }`}
        >
          {gameStatus === `${playerRole} wins` && "Congratulations! You win!"}
          {gameStatus === "tie" && "It's a tie!"}
          {gameStatus === `${playerRole === "X" ? "O wins" : "X wins"}` &&
            "You lose. Better luck next time!"}
        </div>
      )}

      {/* Turn indicator */}
      {(!gameStatus || gameStatus === "ongoing") && (
        <>
          <h2
            tabIndex={0}
            aria-live="polite"
            className={`turn-indicator ${playerRole}`}
          >
            {`You are playing as ${playerRole}`}
          </h2>

          {/* Separate live regions for each message */}
          {playerRole === currentPlayer ? (
            <div tabIndex={0} className="turn-status your-turn" key="your-turn">
              {lastMove
                ? `Your opponent selected ${lastMove}. It's your turn!`
                : "It's your turn!"}
            </div>
          ) : (
            <div tabIndex={0} className="turn-status waiting" key="waiting">
              {lastMove
                ? `You selected ${lastMove}. Waiting for your opponent...`
                : "Waiting for your opponent..."}
            </div>
          )}
        </>
      )}

      {/* Aria-live region for announcing the selected cell and turn announcements */}
      <div aria-live="assertive" className="sr-only">
        {selectedCell}
      </div>
      <div aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      {/* Game board */}
      <div className="game-board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onMouseEnter={() => updateSelectedCell(rowIndex, colIndex, cell)}
              onFocus={() => updateSelectedCell(rowIndex, colIndex, cell)}
              onMouseLeave={() => setSelectedCell("")}
              onBlur={() => setSelectedCell("")}
              className={`game-button ${
                cell === "X" ? "X" : cell === "O" ? "O" : ""
              }`}
            >
              {cell || ""}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
