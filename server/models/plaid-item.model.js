const mongoose = require('mongoose');

const PlaidItemSchema = new mongoose.Schema({
    // Link to the user who owns this bank connection
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // The PERMANENT credentials (Encryption recommended in production)
    plaidAccessToken: { 
        type: String, required: true 
    },
    plaidItemId: { 
        type: String, required: true 
    },
    
    // Metadata for UI (e.g., "Chase", "TD Bank")
    institutionName: { 
        type: String 
    },
    institutionId: { 
        type: String 
    }, // e.g., "ins_3"
    
    // Status tracking (optional but good)
    status: { 
        type: String, default: 'good' 
    } 
}, { timestamps: true });

module.exports = mongoose.model('PlaidItem', PlaidItemSchema);