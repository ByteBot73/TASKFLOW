const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Category name (string)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to the User
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
