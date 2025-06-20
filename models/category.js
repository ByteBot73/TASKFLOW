const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: false }, // Not unique globally, only per user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to the User
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
