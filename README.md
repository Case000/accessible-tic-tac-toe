# Accessible Tic-Tac-Toe

## Project Overview

Accessible Tic-Tac-Toe is a web-based multiplayer game designed with inclusivity in mind, focusing on accessibility for users with sensory impairments. The game allows two anonymous players to compete in a simple tic-tac-toe match. It supports screen reader compatibility, keyboard navigation, and visually accessible design elements, following WCAG 2.1 guidelines to create a more inclusive gaming experience.

### Key features include:

- Accessible tic-tac-toe game interface.
- Screen reader compatibility with live updates on moves and game status.
- API to create and join game sessions, make moves, and view past games.

## Setup Instructions

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (comes with Node.js)

1. Clone the repository:
2. On terminal:
```
cd backend
npm install
node index.js
```
3. Open new terminal:
```
cd frontend
npm install
npm start
```

## API Endpoints (Planned)
- `POST /games`: Create a new game session
- `POST /games/:id/move`: Make a move in a game session
- `GET /games/:id`: Retrieve the game session details
- `GET /games`: Retrieve all game sessions

## Accessibility Considerations
- Screen Reader support
- Keyboard Navigation
- ARIA labels