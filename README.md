# BlockCapture - Real-Time Collaborative Block Game

A playful, real-time web application where multiple users can claim blocks on a shared grid and see changes instantly. Built as a demonstration of real-time collaboration, WebSocket technology, and modern web development practices.

![BlockCapture Demo](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20WebSocket-blue)

## 🎮 Live Demo

**Frontend:** [Deploy to Vercel]  
**Backend:** [Deploy to Railway/Render]

## ✨ Features

- **Real-Time Synchronization**: Instant updates across all connected clients using WebSockets
- **Multi-User Support**: Hundreds of users can play simultaneously without conflicts
- **Conflict Resolution**: Server-side timestamp-based conflict handling ensures fair block claiming
- **User Identification**: Each user gets a unique color and can set a custom name
- **Live Leaderboard**: Real-time rankings showing top players by blocks claimed
- **Premium UI**: Dark mode with glassmorphism effects, smooth animations, and responsive design
- **Connection Management**: Auto-reconnection on disconnect with visual status indicators
- **Performance Optimized**: Efficient state management and selective updates for smooth gameplay

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Vite + React** - Fast development and modern build tooling
- **Vanilla CSS** - Full control over premium design aesthetics
- **WebSocket Client** - Real-time bidirectional communication

**Backend:**
- **Node.js + Express** - Lightweight HTTP server
- **ws Library** - Native WebSocket support
- **JSON Storage** - Simple file-based persistence with auto-save

### System Design

```
┌─────────────┐         WebSocket          ┌─────────────┐
│   Client 1  │ ◄─────────────────────────► │             │
└─────────────┘                             │             │
                                            │   Server    │
┌─────────────┐         WebSocket          │  (Node.js)  │
│   Client 2  │ ◄─────────────────────────► │             │
└─────────────┘                             │             │
                                            │             │
┌─────────────┐         WebSocket          │             │
│   Client N  │ ◄─────────────────────────► │             │
└─────────────┘                             └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  data.json  │
                                            │  (Storage)  │
                                            └─────────────┘
```

**Key Design Decisions:**

1. **WebSocket for Real-Time**: Bidirectional communication allows instant updates without polling
2. **Server as Source of Truth**: All block claims validated server-side to prevent cheating
3. **Optimistic UI Updates**: Client immediately shows changes, server confirms or rejects
4. **First-Come-First-Served**: Conflict resolution based on server-side timestamp
5. **JSON Storage**: Simple, portable, no external database dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd realtimeblock
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3001`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open multiple browser windows**
   - Navigate to `http://localhost:5173` in 2+ browser windows/tabs
   - Click blocks in one window and watch them update in real-time in others!

## 🎯 How It Works

### Real-Time Updates Flow

1. **User Connects**
   - Client establishes WebSocket connection
   - Server assigns unique ID and random color
   - Client receives current grid state and statistics

2. **User Claims Block**
   - User clicks unclaimed block
   - Client sends `claim-block` message via WebSocket
   - Server validates coordinates and checks if block is unclaimed
   - If valid, server updates storage and broadcasts to all clients
   - All connected clients receive update and render the change

3. **Conflict Handling**
   - If two users click the same block simultaneously
   - Server processes requests in order received (timestamp-based)
   - First request succeeds, second receives `claim-failed` message
   - Only the successful claim is broadcast to all clients

### WebSocket Events

**Client → Server:**
- `claim-block` - Attempt to claim a block at (x, y)
- `update-name` - Set or change user's display name

**Server → Client:**
- `init` - Initial connection data (userId, color, grid state, stats)
- `block-claimed` - A block was successfully claimed
- `claim-failed` - Block claim rejected (already claimed)
- `stats-update` - Updated leaderboard and statistics
- `user-count` - Number of connected users changed

## 🔧 Technical Trade-offs

### What I Chose and Why

**✅ JSON File Storage vs Database**
- **Why**: Simplicity, portability, no external dependencies
- **Trade-off**: Not suitable for massive scale (1000s of concurrent users)
- **Mitigation**: Auto-save every 10 seconds + immediate save on block claims

**✅ In-Memory State with Persistence**
- **Why**: Fast read/write operations, simple implementation
- **Trade-off**: Data loss risk on crash (limited to last 10 seconds)
- **Mitigation**: Could add write-ahead logging for production

**✅ 40x40 Grid (1,600 blocks)**
- **Why**: Large enough to be interesting, small enough for smooth performance
- **Trade-off**: Could feel crowded with many users
- **Scaling**: Could implement infinite canvas with viewport-based loading

**✅ Broadcast All Updates**
- **Why**: Simple implementation, ensures consistency
- **Trade-off**: Bandwidth scales with user count
- **Optimization**: Only send changed blocks, not entire grid

**✅ No Authentication**
- **Why**: Reduces friction, focuses on core real-time functionality
- **Trade-off**: No persistent user identity across sessions
- **Future**: Could add optional account system

## 🎨 UI/UX Highlights

- **Dark Mode Theme**: Easy on the eyes for extended play
- **Glassmorphism**: Modern frosted-glass effect on cards
- **Vibrant Color Palette**: 20 carefully curated, distinguishable colors
- **Smooth Animations**: Micro-interactions on hover, claim, and updates
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Visual Feedback**: Clear indicators for connection status, ownership, and actions
- **Accessibility**: Tooltips, semantic HTML, keyboard-friendly

## 📊 Performance Considerations

- **Efficient Rendering**: React's virtual DOM minimizes re-renders
- **Selective Updates**: Only changed blocks trigger UI updates
- **Debounced Saves**: Storage writes batched to reduce I/O
- **Connection Pooling**: WebSocket reuses single connection per client
- **Auto-Reconnection**: Graceful handling of network interruptions

## 🚢 Deployment

### Backend (Railway/Render)

1. Create new project on Railway or Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variable: `PORT=3001` (or use platform default)
6. Deploy and note the WebSocket URL

### Frontend (Vercel/Netlify)

1. Update `client/src/App.jsx`:
   ```javascript
   const WS_URL = 'wss://your-backend-url.com'; // Use wss:// for secure connection
   ```
2. Build the frontend: `cd client && npm run build`
3. Deploy the `dist` folder to Vercel/Netlify
4. Or connect GitHub repo for automatic deployments

## 🧪 Testing

### Manual Testing Checklist

- [ ] Open app in 3+ browser windows
- [ ] Verify each gets unique color
- [ ] Click blocks in one window, verify instant updates in others
- [ ] Test simultaneous clicks on same block (only one should succeed)
- [ ] Enter username, verify it appears in leaderboard
- [ ] Disconnect server, verify reconnection works
- [ ] Test on mobile device
- [ ] Verify leaderboard updates in real-time

### Automated Testing

Currently manual testing only. Future improvements could include:
- Unit tests for React components (Vitest)
- Integration tests for WebSocket events (Jest)
- E2E tests for multi-user scenarios (Playwright)

## 🔮 Future Enhancements

**Gameplay:**
- [ ] Cooldown timer between claims (prevent spam)
- [ ] Territory/area control mechanics
- [ ] Power-ups or special blocks
- [ ] Team mode (collaborative claiming)

**Technical:**
- [ ] Redis for distributed state (multi-server support)
- [ ] Rate limiting per user
- [ ] Compression for WebSocket messages
- [ ] Canvas rendering for larger grids

**UI/UX:**
- [ ] Zoom/pan for navigation
- [ ] Minimap overview
- [ ] Sound effects and haptic feedback
- [ ] Themes (light mode, custom colors)
- [ ] Achievement system

## 📝 Code Structure

```
realtimeblock/
├── server/
│   ├── server.js          # Express + WebSocket server
│   ├── database.js        # JSON storage layer
│   ├── package.json       # Backend dependencies
│   └── data.json          # Persistent storage (auto-generated)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Grid.jsx       # 40x40 grid renderer
│   │   │   ├── Block.jsx      # Individual block component
│   │   │   ├── Header.jsx     # App header with status
│   │   │   └── Sidebar.jsx    # Stats and leaderboard
│   │   ├── hooks/
│   │   │   └── useWebSocket.js # WebSocket connection hook
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Global styles
│   │   └── main.jsx           # React entry point
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
│
└── README.md              # This file
```

## 🤝 Contributing

This is a demo project for an internship assignment. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use this code for learning and experimentation.

## 👨‍💻 Author

Built with ❤️ as a demonstration of real-time web development skills.

---

**Questions or feedback?** Open an issue or reach out!
