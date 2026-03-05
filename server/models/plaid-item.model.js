import mongoose from 'mongoose';

const PlaidItemSchema = new mongoose.Schema({
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
    
    plaidCursor: { 
        type: String, 
        default: null 
    },
    lastSync: { 
        type: Date, 
        default: null 
    },
    lastSyncError: { 
        type: String, 
        default: null 
    },
    status: { 
        type: String, 
        default: 'good' 
    } 
}, { timestamps: true });

export default mongoose.model('PlaidItem', PlaidItemSchema);