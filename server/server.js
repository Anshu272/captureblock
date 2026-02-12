import express from 'express';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    initDatabase,
    getAllBlocks,
    claimBlock,
    upsertUser,
    updateUserName,
    updateUserColor,
    getStats,
    getUser,
    clearBlocksByUserId
} from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || '*'
        : '*',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const COLORS = [
    '#FF6B6B', '#FF8E53', '#FFA500', '#FFD93D', '#6BCB77',
    '#4D96FF', '#6C5CE7', '#A29BFE', '#FD79A8', '#E84393',
    '#00B894', '#00CEC9', '#0984E3', '#74B9FF', '#FF1744',
    '#FDCB6E', '#E17055', '#D63031', '#9B59B6', '#16A085'
];

function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

app.get('/api/grid', (req, res) => {
    try {
        const blocks = getAllBlocks();
        res.json({ blocks });
    } catch (error) {
        console.error('Error fetching grid:', error);
        res.status(500).json({ error: 'Failed to fetch grid' });
    }
});

app.get('/api/stats', (req, res) => {
    try {
        const stats = getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.get('/api/colors', (req, res) => {
    res.json({ colors: COLORS });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const clients = new Map();

function broadcast(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client, ws) => {
        if (ws.readyState === 1) { // ws.OPEN
            ws.send(messageStr);
        }
    });
}

function broadcastUserCount() {
    broadcast({
        type: 'user-count',
        count: clients.size
    });
}

function broadcastStats() {
    const stats = getStats();
    broadcast({
        type: 'stats-update',
        stats
    });
}

async function start() {
    await initDatabase();


    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        const userId = uuidv4();
        const userColor = getRandomColor();

        clients.set(ws, { userId, color: userColor, name: null });


        upsertUser(userId, userColor);

        console.log(`👤 User connected: ${userId} (${userColor})`);

        ws.send(JSON.stringify({
            type: 'init',
            userId,
            color: userColor,
            blocks: getAllBlocks(),
            stats: getStats(),
            connectedUsers: clients.size
        }));

        broadcastUserCount();


        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                switch (data.type) {
                    case 'claim-block':
                        handleClaimBlock(ws, data);
                        break;

                    case 'update-name':
                        handleUpdateName(ws, data);
                        break;

                    case 'update-color':
                        handleUpdateColor(ws, data);
                        break;

                    default:
                        console.log('Unknown message type:', data.type);
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        ws.on('close', () => {
            const client = clients.get(ws);
            if (client) {
                console.log(`👋 User disconnected: ${client.userId}`);

                clearBlocksByUserId(client.userId).then(clearedBlocks => {
                    if (clearedBlocks.length > 0) {
                        console.log(`🧹 Cleared ${clearedBlocks.length} blocks for user ${client.userId}`);

                        broadcast({
                            type: 'blocks-cleared',
                            blocks: clearedBlocks.map(b => ({ x: b.x, y: b.y }))
                        });


                        broadcastStats();
                    }
                });

                clients.delete(ws);
                broadcastUserCount();
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
}

function handleClaimBlock(ws, data) {
    const client = clients.get(ws);
    if (!client) return;

    const { x, y } = data;
    const { userId, color, name } = client;

    if (typeof x !== 'number' || typeof y !== 'number' ||
        x < 0 || x >= 40 || y < 0 || y >= 20) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid coordinates'
        }));
        return;
    }

    const success = claimBlock(x, y, userId, color, name);

    if (success) {
        const update = {
            type: 'block-claimed',
            block: {
                x,
                y,
                owner_id: userId,
                owner_color: color,
                owner_name: name,
                claimed_at: new Date().toISOString()
            }
        };

        broadcast(update);

        broadcastStats();
    } else {
        ws.send(JSON.stringify({
            type: 'claim-failed',
            x,
            y,
            message: 'Block already claimed'
        }));
    }
}

function handleUpdateName(ws, data) {
    const client = clients.get(ws);
    if (!client) return;

    const { name } = data;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return;
    }

    const trimmedName = name.trim().slice(0, 20);


    client.name = trimmedName;

    updateUserName(client.userId, trimmedName);


    ws.send(JSON.stringify({
        type: 'name-updated',
        name: trimmedName
    }));

    broadcastStats();
}

function handleUpdateColor(ws, data) {
    const client = clients.get(ws);
    if (!client) return;

    const { color } = data;
    if (!color || typeof color !== 'string' || !COLORS.includes(color)) {
        return;
    }

    client.color = color;


    updateUserColor(client.userId, color);

    broadcast({
        type: 'user-color-updated',
        userId: client.userId,
        color: color
    });

    broadcastStats();
}

start().catch(err => {
    console.error('FATAL ERROR STARTING SERVER:', err);
});
