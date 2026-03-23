import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    plaidItemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PlaidItem',
        required: true 
    },
    accountId: { 
        type: String, 
        required: true,
        unique: true 
    },
    institution: {
        name: String,
        id: String,
    },
    name: String,
    mask: String,
    type: String,
    subtype: String,
    currency: String,
    balances: {
        currentBalance: Number,
        availableBalance: Number,
        limit: Number
    },
}, { timestamps: true });

AccountSchema.index({ userId: 1 });

export default mongoose.model('Account', AccountSchema);
