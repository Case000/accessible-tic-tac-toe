# Accessible Tic-Tac-Toe Web Application Documentation

## Types of Disabilities Considered
This web application is designed to accommodate users with the following disabilities:
1. **Cognitive** – Simplified UI with clear instructions and minimal distractions.
2. **Visual** – Aria-labels and screen-reader support for intuitive navigation, including clear live announcements.
3. **Auditory** – Text-based indicators for turn changes and results, ensuring full participation without sound reliance.
4. **Motor** – Larger click areas, adjustable spacing, and keyboard navigation.
5. **Speech** – Fully navigable without voice commands for those with speech impairments.

---

## 1. Instructions to Load and Play the Game
1. **Load the Web Application**  
   Open the application by entering the provided URL (e.g., `http://your_ip_address:3000`) in your browser. Ensure any pop-up blockers or ad blockers are disabled.

2. **Create a Game Session**  
   Click the "Create New Game" button on the homepage. The application will generate a unique game ID and add it to the list of available games.

3. **Joining from Another Browser**  
   Open the application in a new browser window or on another device connected to the same network, select the game session ID, and click to join. Once both players have joined, they are assigned player roles (X or O).

4. **Playing the Game**  
   Each player can take turns selecting an empty cell on the 3x3 grid. Text prompts and live announcements guide the players through their turns until a player wins or the game ends in a tie.

---

## 2. Design Decisions for Testing with Persons-with-Disabilities

I conducted accessibility testing using screen-reader simulations and keyboard-only navigation to assess usability for users with various disabilities:
- **Screen Reader Interaction**: Testing ensured that screen readers announced moves, turns, and game results with the help of aria-live regions and polite alerts.
- **Keyboard Navigation**: All interactive elements, including game cells and controls, were tested to ensure full navigation without a mouse.
- **Sensory Impairment Simulation**: Color-coded cells for X and O moves and large clickable areas were tested for motor and visual accessibility. Adjusted gap and spacing ensure touch accessibility on mobile devices.

*Example Screenshots:*
1. The main game board with focus indicators for screen readers.
2. Visual prompts like “Your turn” and “Waiting for opponent.”

*Alternatively, video walkthroughs demonstrate accessible interaction for users with visual or motor impairments.*

---

## 3. API Specifications

### List of API Endpoints
| Endpoint                | Method | Description                     |
|-------------------------|--------|---------------------------------|
| `/api/games`            | GET    | Retrieve all available games    |
| `/api/games/:id`        | GET    | Retrieve specific game details  |
| `/api/games/:id/move`   | POST   | Make a move in the game         |
| `/api/games/:id/join`   | POST   | Join a specific game session    |

### Sample API Requests
- **Retrieve All Games**  
  **GET** `/api/games`
  ```curl
  curl -X GET http://localhost:5000/api/games

- **Retrieve Specific Game**  
  **GET** `/api/games/1`
  ```curl
  curl -X GET http://localhost:5000/api/games/1

- **Join Game Session**  
  **POST** `/api/games/1/join`
  ```curl
  curl -X POST http://localhost:5000/api/games/1/join -d '{"playerId": "player1"}' -H "Content-Type: application/json"

- **Make a Move**  
  **POST** `/api/games/1/move`
  ```curl
  curl -X POST http://localhost:5000/api/games/1/move -d '{"playerId": "player1", "row": 0, "col": 1}' -H "Content-Type: application/json"


## 4. Summary of Design and Accessibility Considerations

This Tic-Tac-Toe web application emphasizes accessibility by using Aria roles, live regions, and keyboard navigation support. The design leverages simple UI and color contrast to aid users with sensory and cognitive disabilities. Infrastructure-wise, the application uses RESTful APIs for frontend-backend communication, ensuring compatibility across devices. Responsiveness across desktop and mobile views was achieved through CSS media queries and flexible layouts, enabling seamless use on various devices. Accessibility features, including screen-reader support and intuitive focus indicators, were integrated for an inclusive, user-friendly experience.

## 5. Architecture Diagram

                 +------------------------+
                 |      Client (Browser)  |
                 |    (React Frontend)    |
                 +-----------+------------+
                             ^
                             |
                             v
                 +------------------------+
                 |       Express API      |
                 |       (Backend)        |
                 +-----------+------------+
                             ^
                             |
                             v
                 +------------------------+
                 |      MySQL Database    |
                 |    (Game Storage)      |
                 +------------------------+

- Client (Browser): Hosts the React frontend, connecting users with the game board and API endpoints.

- Express API (Backend): Manages game state, player actions, and provides game data through RESTful APIs.

- MySQL Database: Stores game sessions, player moves, and related data, ensuring game continuity and multi-session support.