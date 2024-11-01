# Accessible Tic-Tac-Toe

## Project Overview
Accessible Tic-Tac-Toe is a web-based multiplayer game crafted with inclusivity as a core design goal. This project is focused on creating an accessible, enjoyable experience for users with various sensory impairments, aligning with the Web Content Accessibility Guidelines (WCAG) 2.1. Two anonymous players can compete in a classic tic-tac-toe match, with the interface and functionality optimized for screen readers, keyboard navigation, and other assistive technologies.

### Key Features:
- **Accessible Game Interface**: Intuitive layout and accessible controls tailored for users with visual, cognitive, auditory, motor, and speech impairments.
- **Screen Reader Compatibility**: Real-time announcements for moves, game status, and player turns, enabling users who rely on screen readers to engage effectively.
- **Multiplayer Session Management**: An API-driven backend supporting game session creation, player joining, move updates, and viewing past games.
- **WCAG Compliance**: Designed with color contrast, focus indicators, and live region alerts for an accessible and inclusive gaming experience.

## Video Demo
https://youtu.be/fZrepYa41Fc

## Documentation
For detailed documentation, including setup, accessibility considerations, API specifications, and infrastructure design, please refer to the [Documentation](./DOCUMENTATION.md).

## Setup Instructions

### Prerequisites
Ensure the following are installed on your machine:
- **Node.js** (v14 or higher)
- **npm** (usually bundled with Node.js)
- **MySQL** (ensure it is running and accessible)

### Getting Started in local
1. Clone the repository:
   ```bash
   git clone <https://github.com/Case000/accessible-tic-tac-toe.git>
   cd accessible-tic-tac-toe
   ```
2. Navigate to the backend directory, install dependencies and start the backend server:
```bash
cd backend
npm install
npm start
```
3. Open a new terminal window, navigate to the frontend directory, install dependencies, and start the frontend server:
```bash
cd frontend
npm install
npm start
```
4. Once both servers are running:
- Open http://localhost:3000 (or the designated IP address on your network) on two separate devices or browser windows to initiate a multiplayer game.
- Create a game session and join to begin playing.