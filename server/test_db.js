import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Testing connection to:', process.env.MONGODB_URI?.split('@')[1]);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Success!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}
test();
