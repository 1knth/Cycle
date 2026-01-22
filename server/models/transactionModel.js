const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true // Prevents duplicates automatically
    },
    account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    pending: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Transactions', transactionSchema);