const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the message schema
const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    recipientId: {
        type: String,
        required: true
    },
    status: { 
        type: String,
        enum: ['sent', 'delivered', 'seen'], 
        default: 'sent' 
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
