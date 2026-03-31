import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
  },
  accountId: {
    type: String,
    required: true
  },
  plaidItemId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlaidItem',
      required: true
  },
  amount: {
    type: Number,
    required: true
  },
  categoryId: String,
  date: {
    type: Date,
    required: true
  },

  name: String,
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

export default mongoose.model('Transaction', TransactionSchema);

