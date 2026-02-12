import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Block from './models/Block.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let inMemoryData = {
    blocks: {},
    users: {}
};

export async function initDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

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

export function getAllBlocks() {
    return Object.values(inMemoryData.blocks);
}

export function claimBlock(x, y, userId, userColor, userName) {
    const key = `${x},${y}`;

    if (inMemoryData.blocks[key]) {
        return false;
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


    Block.create(blockData).catch(err => console.error('Error saving block:', err));

    if (inMemoryData.users[userId]) {
        inMemoryData.users[userId].blocks_claimed++;
        inMemoryData.users[userId].last_active = new Date();

        User.updateOne(
            { id: userId },
            { $inc: { blocks_claimed: 1 }, last_active: new Date() }
        ).catch(err => console.error('Error updating user block count:', err));
    }

    return true;
}

export async function upsertUser(userId, color, name = null) {
    const update = { color, last_active: new Date() };
    if (name) update.name = name;

    if (!inMemoryData.users[userId]) {
        inMemoryData.users[userId] = { id: userId, ...update, blocks_claimed: 0 };
    } else {
        Object.assign(inMemoryData.users[userId], update);
    }

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

export function updateUserName(userId, name) {
    if (inMemoryData.users[userId]) {
        inMemoryData.users[userId].name = name;
        inMemoryData.users[userId].last_active = new Date();

        Object.values(inMemoryData.blocks).forEach(block => {
            if (block.owner_id === userId) {
                block.owner_name = name;
            }
        });

        User.updateOne({ id: userId }, { name, last_active: new Date() }).catch(err => console.error(err));
        Block.updateMany({ owner_id: userId }, { owner_name: name }).catch(err => console.error(err));
    }
}

export function updateUserColor(userId, color) {
    if (inMemoryData.users[userId]) {
        inMemoryData.users[userId].color = color;
        inMemoryData.users[userId].last_active = new Date();

        Object.values(inMemoryData.blocks).forEach(block => {
            if (block.owner_id === userId) {
                block.owner_color = color;
            }
        });

        User.updateOne({ id: userId }, { color, last_active: new Date() }).catch(err => console.error(err));
        Block.updateMany({ owner_id: userId }, { owner_color: color }).catch(err => console.error(err));
    }
}

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

export function getUser(userId) {
    return inMemoryData.users[userId] || null;
}

export async function clearBlocksByUserId(userId) {
    const clearedBlocks = [];

    Object.keys(inMemoryData.blocks).forEach(key => {
        if (inMemoryData.blocks[key].owner_id === userId) {
            clearedBlocks.push(inMemoryData.blocks[key]);
            delete inMemoryData.blocks[key];
        }
    });

    // Always delete the user from memory and DB on disconnect
    delete inMemoryData.users[userId];

    try {
        await Block.deleteMany({ owner_id: userId });
        await User.deleteOne({ id: userId });
        if (clearedBlocks.length > 0) {
            console.log(`🧹 Cleared ${clearedBlocks.length} blocks for user ${userId}`);
        }
    } catch (err) {
        console.error('Error clearing user data:', err);
    }

    return clearedBlocks;
}

export default inMemoryData;

