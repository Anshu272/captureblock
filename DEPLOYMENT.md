# Deploying to Render

This guide will help you deploy your Real-Time Block Capture application to Render.

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. Your MongoDB Atlas connection string
3. This repository pushed to GitHub/GitLab

## Deployment Options

### Option 1: Using Render Blueprint (Recommended)

This will deploy both the server and client automatically.

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create a New Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   
   For the **server** service, add these environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your frontend URL (will be provided after client deploys, e.g., `https://realtimeblock-client.onrender.com`)
   
   For the **client** service, add these environment variables:
   - `VITE_WS_URL`: Your WebSocket URL (e.g., `wss://realtimeblock-server.onrender.com`)
   - `VITE_API_URL`: Your API URL (e.g., `https://realtimeblock-server.onrender.com`)

4. **Deploy**
   - Click "Apply" to deploy both services
   - Wait for the build to complete (5-10 minutes)

### Option 2: Manual Deployment

#### Deploy the Server

1. **Create a new Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: `realtimeblock-server`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

2. **Add Environment Variables**
   - `PORT`: `10000` (Render provides this automatically)
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: (Add after deploying frontend)

3. **Deploy** and note your server URL (e.g., `https://realtimeblock-server.onrender.com`)

#### Deploy the Client

1. **Create a new Static Site**
   - Go to Render Dashboard → "New" → "Static Site"
   - Connect your repository
   - Configure:
     - **Name**: `realtimeblock-client`
     - **Branch**: `main`
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

2. **Add Environment Variables**
   - `VITE_WS_URL`: `wss://your-server-url.onrender.com` (use WSS for secure WebSocket)
   - `VITE_API_URL`: `https://your-server-url.onrender.com`

3. **Deploy** and note your client URL

4. **Update Server Environment**
   - Go back to your server service
   - Add/update `FRONTEND_URL` with your client URL
   - Redeploy the server

## Important Notes

### WebSocket Configuration
- Use `wss://` (secure WebSocket) instead of `ws://` in production
- Render automatically provides SSL certificates

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on services

### MongoDB Atlas
Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Render's IP addresses to the allowlist.

## Testing Your Deployment

1. Visit your client URL
2. Open browser console to check for connection errors
3. Try claiming blocks
4. Open multiple browser tabs to test real-time synchronization

## Troubleshooting

### WebSocket Connection Failed
- Verify `VITE_WS_URL` uses `wss://` not `ws://`
- Check server logs for errors
- Ensure server is running and healthy

### CORS Errors
- Verify `FRONTEND_URL` is set correctly in server environment
- Check that the URL matches exactly (no trailing slash)

### Database Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings
- Review server logs for connection errors

## Environment Variables Summary

### Server (.env)
```bash
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/block_capture
NODE_ENV=production
FRONTEND_URL=https://your-client-url.onrender.com
```

### Client (.env)
```bash
VITE_WS_URL=wss://your-server-url.onrender.com
VITE_API_URL=https://your-server-url.onrender.com
```

## Updating Your Deployment

Render automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Both services will rebuild and redeploy automatically.
