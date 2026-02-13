const mongoose = require('mongoose');

const LinkTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    linkToken: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LinkToken', LinkTokenSchema);