import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
    accountId: String,
    plaidItemId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlaidItem',
        required: true
    },
    amount: Number,
    category_id: String,
    date: Date,
    merchantName: String,
    plaidTransactionId: { 
        type: String, unique: true 
    },
    pending: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ plaidTransactionId: 1 });

const Transactions = mongoose.model('Transaction', TransactionSchema);

export { Transactions };