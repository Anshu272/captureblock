import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Block from './models/Block.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// In-memory cache for speed
let inMemoryData = {
    blocks: {}, // key: "x,y"
    users: {}   // key: userId
};

// Initialize database
export async function initDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Initial Load: Load all blocks and users into memory
        const allBlocks = await Block.find({});
        const allUsers = await User.find({});

        allBlocks.forEach(block => {
            inMemoryData.blocks[`${block.x},${block.y}`] = block.toObject();
        });

        allUsers.forEach(user => {
            inMemoryData.users[user.id] = user.toObject();
        });

        console.log(`✅ Loaded ${allBlocks.length} blocks and ${allUsers.length} users into memory`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

// Get all blocks (from memory)
export function getAllBlocks() {
    return Object.values(inMemoryData.blocks);
}

// Claim a block (Memory first, then DB)
export function claimBlock(x, y, userId, userColor, userName) {
    const key = `${x},${y}`;

    if (inMemoryData.blocks[key]) {
        return false; // Already claimed
    }

    // 1. Update Memory immediately
    const blockData = {
        x,
        y,
        owner_id: userId,
        owner_color: userColor,
        owner_name: userName,
        claimed_at: new Date()
    };
    inMemoryData.blocks[key] = blockData;

    // 2. Persist to DB in background
    Block.create(blockData).catch(err => console.error('Error saving block:', err));

    // 3. Update user stats in memory
    if (inMemoryData.users[userId]) {
        inMemoryData.users[userId].blocks_claimed++;
        inMemoryData.users[userId].last_active = new Date();

        // Persist user update to DB
        User.updateOne(
            { id: userId },
            { $inc: { blocks_claimed: 1 }, last_active: new Date() }
        ).catch(err => console.error('Error updating user block count:', err));
    }

    return true;
}

// Create or update user
export async function upsertUser(userId, color, name = null) {
    const update = { color, last_active: new Date() };
    if (name) update.name = name;

    // 1. Update memory
    if (!inMemoryData.users[userId]) {
        inMemoryData.users[userId] = { id: userId, ...update, blocks_claimed: 0 };
    } else {
        Object.assign(inMemoryData.users[userId], update);
    }

    // 2. Persist to DB
    try {
        await User.findOneAndUpdate(
            { id: userId },
            { $set: update },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Error upserting user:', err);
    }
}

// Update user name
export function updateUserName(userId, name) {
    if (inMemoryData.users[userId]) {
        // 1. Update memory
        inMemoryData.users[userId].name = name;
        inMemoryData.users[userId].last_active = new Date();

        // Update memory blocks
        Object.values(inMemoryData.blocks).forEach(block => {
            if (block.owner_id === userId) {
                block.owner_name = name;
            }
        });

        // 2. Persist to DB
        User.updateOne({ id: userId }, { name, last_active: new Date() }).catch(err => console.error(err));
        Block.updateMany({ owner_id: userId }, { owner_name: name }).catch(err => console.error(err));
    }
}

// Update user color
export function updateUserColor(userId, color) {
    if (inMemoryData.users[userId]) {
        // 1. Update memory
        inMemoryData.users[userId].color = color;
        inMemoryData.users[userId].last_active = new Date();

        // Update memory blocks
        Object.values(inMemoryData.blocks).forEach(block => {
            if (block.owner_id === userId) {
                block.owner_color = color;
            }
        });

        // 2. Persist to DB
        User.updateOne({ id: userId }, { color, last_active: new Date() }).catch(err => console.error(err));
        Block.updateMany({ owner_id: userId }, { owner_color: color }).catch(err => console.error(err));
    }
}

// Get statistics
export function getStats() {
    const totalBlocksClaimed = Object.keys(inMemoryData.blocks).length;
    const totalUsers = Object.keys(inMemoryData.users).length;

    const leaderboard = Object.values(inMemoryData.users)
        .filter(user => user.blocks_claimed > 0)
        .sort((a, b) => b.blocks_claimed - a.blocks_claimed)
        .slice(0, 10)
        .map(user => ({
            id: user.id,
            color: user.color,
            name: user.name,
            blocks_claimed: user.blocks_claimed
        }));

    return {
        totalBlocksClaimed,
        totalUsers,
        leaderboard
    };
}

// Get user info
export function getUser(userId) {
    return inMemoryData.users[userId] || null;
}

// Clear blocks owned by a user
export async function clearBlocksByUserId(userId) {
    const clearedBlocks = [];

    // 1. Find blocks to clear (memory)
    Object.keys(inMemoryData.blocks).forEach(key => {
        if (inMemoryData.blocks[key].owner_id === userId) {
            clearedBlocks.push(inMemoryData.blocks[key]);
            delete inMemoryData.blocks[key];
        }
    });

    if (clearedBlocks.length > 0) {
        // 2. Update memory user
        delete inMemoryData.users[userId];

        // 3. Persist to DB
        try {
            await Block.deleteMany({ owner_id: userId });
            await User.deleteOne({ id: userId });
        } catch (err) {
            console.error('Error clearing user data:', err);
        }
    }

    return clearedBlocks;
}

export default inMemoryData;

