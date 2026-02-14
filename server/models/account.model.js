const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    plaidItemId: { 
        type: String, 
        required: true 
    },
    plaidAccountId: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: String,
    officialName: String,
    mask: String,
    type: String,
    subtype: String,
    currentBalance: Number,
    availableBalance: Number,
    currency: String,
    institutionName: String,
    institutionId: String
}, { timestamps: true });

AccountSchema.index({ userId: 1 });

module.exports = mongoose.model('Account', AccountSchema);
