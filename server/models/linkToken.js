// const client = require('plaid');

// const TokenSchema = new mongoose.Schema({
//     // ADD THIS: To store the link to their bank
//     connectionId: { type: String },
//     bank: { type: String }
// });

// module.exports = mongoose.model('Link', TokenSchema);


const mongoose = require('mongoose');

const LinkTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    linkToken: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LinkToken', LinkTokenSchema);