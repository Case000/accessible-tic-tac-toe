import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000/api';

export const getAllGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};

export const createGame = async () => {
  const response = await axios.post(`${API_URL}/newgame`);
  return response.data;
};

export const getGame = async (gameId: string) => {
  const response = await axios.get(`${API_URL}/games/${gameId}`);
  return response.data;
};

export const joinGame = async (gameId: string, playerId: string) => {
  const response = await axios.post(`${API_URL}/games/${gameId}/join`, { playerId });
  return response.data; // { role: 'X' or 'O', gameId, status }
};

export const makeMove = async (gameId: string, player: string, row: number, col: number) => {
  const response = await axios.post(`${API_URL}/games/${gameId}/move`, { player, row, col });
  return response.data;
};