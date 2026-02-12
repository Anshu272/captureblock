import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({ id: String });
const BlockSchema = new mongoose.Schema({ x: Number, y: Number });

const User = mongoose.model('User', UserSchema);
const Block = mongoose.model('Block', BlockSchema);

async function reset() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const blockRes = await Block.deleteMany({});
        console.log(`🧹 Deleted ${blockRes.deletedCount} blocks`);

        const userRes = await User.deleteMany({});
        console.log(`🧹 Deleted ${userRes.deletedCount} users`);

        console.log('✨ Database reset successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

reset();
