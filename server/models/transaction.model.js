const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
    plaidItemId: { 
        type: String, ref: 'PlaidItem' 
    },
    amount: Number,
    category: {
        primary: String,
        secondary: String
    },
    date: Date,
    merchantName: String,
    plaidTransactionId: { 
        type: String, unique: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);