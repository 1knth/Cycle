const mongoose = require('mongoose');

const PlaidItemSchema = new mongoose.Schema({
    // Link to the user who owns this bank connection
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    plaidAccessToken: { 
        type: String, required: true 
    },
    plaidItemId: { 
        type: String, required: true 
    },
    
    institutionName: { 
        type: String 
    },
    institutionId: { 
        type: String 
    },
    
    status: { 
        type: String, default: 'good' 
    } 
}, { timestamps: true });

module.exports = mongoose.model('PlaidItem', PlaidItemSchema);