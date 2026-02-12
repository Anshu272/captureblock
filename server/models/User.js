import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, default: null },
    color: { type: String, required: true },
    blocks_claimed: { type: Number, default: 0 },
    last_active: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
