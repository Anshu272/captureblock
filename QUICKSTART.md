# Quick Start Guide

## 🚀 Running the Application Locally

### Step 1: Start the Backend Server

```bash
cd /home/anshu/Documents/realtimeblock/server
npm start
```

You should see:
```
🎮 Real-Time Block Capture Server Ready!
🚀 Server running on port 3001
✅ Database initialized
```

### Step 2: Start the Frontend (in a new terminal)

The frontend is already running! If you need to restart it:

```bash
cd /home/anshu/Documents/realtimeblock/client
npm run dev
```

You should see:
```
VITE v7.3.1  ready in 267 ms
➜  Local:   http://localhost:5173/
```

### Step 3: Test Multi-User Functionality

1. Open **http://localhost:5173** in your browser
2. Open the same URL in 2-3 more browser windows (or use incognito mode)
3. Each window should show a different color badge in the header
4. Click blocks in one window and watch them update instantly in all others!

## 🎮 How to Play

1. **Claim Blocks**: Click any gray (unclaimed) block to claim it
2. **Set Your Name**: Type your name in the header input field
3. **Compete**: Try to claim more blocks than other players
4. **Watch the Leaderboard**: See your ranking update in real-time

## ✅ What to Verify

- [ ] Connection status shows "Connected" with green dot
- [ ] You have a unique color badge
- [ ] Clicking blocks changes their color to yours
- [ ] "Your Stats" shows correct block count
- [ ] Other browser windows see your claims instantly
- [ ] Leaderboard updates when you claim blocks
- [ ] Online user count increases with each new window

## 🚢 Deployment

### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Railway will auto-detect Node.js
5. Set start command: `cd server && npm start`
6. Deploy and copy the WebSocket URL

### Frontend (Vercel)

1. Update `client/src/App.jsx` line 8:
   ```javascript
   const WS_URL = 'wss://your-app.railway.app'; // Replace with your Railway URL
   ```
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Vite
5. Set root directory to `client`
6. Deploy!

## 📝 Notes

- Backend server is currently running on port 3001
- Frontend dev server is on port 5173
- Data is persisted in `server/data.json`
- WebSocket reconnects automatically if connection drops

## 🎯 Testing Checklist

- [x] Backend server running ✅
- [x] Frontend dev server running ✅
- [ ] Test in multiple browser windows
- [ ] Verify real-time synchronization
- [ ] Test name input functionality
- [ ] Check leaderboard updates
- [ ] Test on mobile device (responsive design)

---

**Need help?** Check the main [README.md](file:///home/anshu/Documents/realtimeblock/README.md) for detailed documentation.
