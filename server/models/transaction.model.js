const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
    accountId: String,
    plaidItemId: { 
        type: String, ref: 'PlaidItem' 
    },
    amount: Number,
    category_id: String,
    date: Date,
    merchantName: String,
    plaidTransactionId: { 
        type: String, unique: true 
    }
}, { timestamps: true });

const Transactions = mongoose.model('Transaction', TransactionSchema);

const MetricsSchema = new mongoose.Schema({
    balance: Number,
    spend: Number,
    bills: Number,
    avgtxn: Number,
    annualDelta: {
        balance: Number,
        growth: Number,
        percecntage: Number
    },

}, { timestamps: true });

const Metrics = mongoose.model('Metric', MetricsSchema);

module.exports = {Transactions, Metrics};