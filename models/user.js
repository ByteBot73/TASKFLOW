const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    discordId: { type: String, unique: true, sparse: true }, // Optional, sparse allows nulls
    // Store Discord tokens if you need to make API calls on user's behalf later
    discordAccessToken: { type: String },
    discordRefreshToken: { type: String },
    discordExpiresAt: { type: Date } // When the access token expires
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
