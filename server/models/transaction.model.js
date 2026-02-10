const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plaidItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlaidItem' },
    amount: Number,
    category: [String],
    date: Date,
    merchantName: String,
    plaidTransactionId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);