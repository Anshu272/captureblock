import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    owner_id: { type: String, required: true },
    owner_color: { type: String, required: true },
    owner_name: { type: String, default: null },
    claimed_at: { type: Date, default: Date.now }
});

// Compound index to ensure uniqueness per coordinate and fast lookups
blockSchema.index({ x: 1, y: 1 }, { unique: true });

const Block = mongoose.model('Block', blockSchema);
export default Block;
