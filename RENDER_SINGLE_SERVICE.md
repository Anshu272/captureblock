# Single Service Deployment Configuration

## Render Web Service Settings

### Build Command
```bash
npm install && cd client && npm install && npm run build && cd ../server && npm install
```

### Start Command
```bash
cd server && npm start
```

### Environment Variables
```bash
PORT=10000
MONGODB_URI=mongodb+srv://anshu:2004anshu@cluster0.g3uljcz.mongodb.net/block_capture?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
```

### Root Directory
```
.
```

## What This Does
- Installs dependencies for both client and server
- Builds the React client into static files
- Server serves the built React app in production
- WebSocket connections work on the same domain
- No CORS issues since everything runs on one service

## After Deployment
Your app will be available at: `https://your-app-name.onrender.com`
- Frontend: `https://your-app-name.onrender.com`
- API: `https://your-app-name.onrender.com/api/*`
- WebSocket: `wss://your-app-name.onrender.com`
