# BlockCapture

A real-time collaborative block-claiming game built with React and Node.js.

## 🚀 How It Works
- **Frontend**: Vite + React for a fast, responsive UI.
- **Backend**: Node.js + Express handling API requests and WebSocket connections.
- **Data Persistence**: Managed through a storage layer in `server/database.js` (JSON/MongoDB).
- **Architecture**: A grid-based system where users can claim blocks, view a live leaderboard, and see real-time statistics.

## ⚡ Real-Time Updates
The application uses **WebSockets (`ws`)** for instant synchronization:
1. **Connection**: On start, the client establishes a persistent WebSocket connection.
2. **Action**: When a user claims a block, a message is sent to the server.
3. **Validation & Broadcast**: The server validates the claim and broadcasts a `block-claimed` event to all connected clients.
4. **Auto-Update**: All clients receive the update and re-render the grid instantly, ensuring every user sees the same state without refreshing.

## �️ Setup
1. `npm install` in both `client` and `server` directories.
2. Start the server: `cd server && npm start`
3. Start the client: `cd client && npm run dev`
