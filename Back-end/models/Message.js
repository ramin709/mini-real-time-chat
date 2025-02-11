const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user: {type: String},
    content: {type: String},
    timestamp: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Message', MessageSchema)