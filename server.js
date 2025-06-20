require('dotenv').config(); // THIS MUST BE THE VERY FIRST LINE

// --- INITIAL ENVIRONMENT VARIABLES CHECK ---
// This part ensures dotenv is loading variables.
// If you see "NOT LOADED" here, your .env file is still not being read correctly.
console.log('--- Initial Environment Variables Check ---');
console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID ? 'Loaded' : 'NOT LOADED');
console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('DISCORD_REDIRECT_URI:', process.env.DISCORD_REDIRECT_URI || 'Not Set, using default');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('-----------------------------------------');


// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Tokens
// CRITICAL FIX: Changed import for node-fetch to correctly get the 'fetch' function
const { default: fetch } = require('node-fetch'); // For making HTTP requests from Node.js

// Import Mongoose Models from separate files
// Updated User model definition to include discordUsername and discordDiscriminator
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    discordId: { type: String, unique: true, sparse: true }, // Add sparse for unique index that allows nulls
    discordUsername: { type: String }, // Store Discord username
    discordDiscriminator: { type: String }, // Store Discord discriminator (e.g., #1234)
    discordAccessToken: { type: String, select: false }, // Store for future API calls, but don't return by default
    discordRefreshToken: { type: String, select: false },
    discordExpiresAt: { type: Date, select: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const Category = require('./models/category'); // Assuming category and card models are stable
const Card = require('./models/card');

const app = express();
const port = 3000; // The port your backend server will listen on

// --- Configuration ---
const MONGODB_URI = 'mongodb+srv://georgeortman19:9c5qdSpwHAUY4HMF@cluster0.zrxpezv.mongodb.net/'; // Your MongoDB URI

// Ensure JWT_SECRET is always a string. If process.env.JWT_SECRET is undefined, throw an error immediately.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) { // Add length check for robustness
    console.error("FATAL ERROR: JWT_SECRET environment variable is missing, not a string, or too short.");
    console.error("Please set a strong JWT_SECRET in your .env file (e.g., use a tool to generate a random 32-character string).");
    process.exit(1); // Exit the process as we cannot proceed securely without a JWT secret
}

// Discord OAuth Configuration (robustly check and set defaults/exit if critical)
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/discord/callback';
const DISCORD_SCOPES = 'identify'; // We only need 'identify' for basic user info (Discord ID)

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.warn("WARNING: Discord Client ID or Secret not fully configured. Discord integration may not work.");
    // No process.exit here as the core app can still function without Discord integration.
}


// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit if DB connection fails, as app is unusable
  });

// --- Middleware ---
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files (where your HTML/CSS/JS will be)

// --- Authentication Middleware (Highly Instrumented) ---
const authenticateToken = (req, res, next) => {
    console.log('\n--- AUTHENTICATION MIDDLEWARE START ---');
    const authHeader = req.headers['authorization'];
    console.log('1. Authorization Header Received:', authHeader);

    // Check if the header is missing entirely
    if (!authHeader) {
        console.log('2. No Authorization header found. Returning 401.');
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    // Extract the token (expecting "Bearer TOKEN_STRING")
    const token = authHeader.split(' ')[1]; // Get the part after "Bearer "
    console.log('3. Extracted Token:', token ? 'Token present (not null/undefined)' : 'Token missing after "Bearer "');
    // console.log('3a. Full Extracted Token:', token); // Uncomment this line if you want to see the token itself (BE CAREFUL IN PRODUCTION)

    // Check if the token string itself is missing after split
    if (!token) {
        console.log('4. Token string is empty or invalid format after split. Returning 401.');
        return res.status(401).json({ message: 'Authentication token required (invalid format).' });
    }

    // Verify the token using the secret
    console.log('5. Attempting to verify token with JWT_SECRET length:', JWT_SECRET.length);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('6. JWT Verification FAILED!');
            console.error('   Error Type:', err.name); // e.g., TokenExpiredError, JsonWebTokenError
            console.error('   Error Message:', err.message); // e.g., "jwt expired", "invalid signature"
            console.error('   Full Error Object:', err); // Log the full error for detailed debugging

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid authentication token. Please log in again.' });
            } else {
                return res.status(403).json({ message: 'Authentication failed. Please log in again.' });
            }
        }

        // If verification is successful
        console.log('6. JWT Verification SUCCESS! User payload:', user);
        req.user = user; // Attach decoded user payload to request
        console.log('--- AUTHENTICATION MIDDLEWARE END (SUCCESS) ---');
        next(); // Proceed to the next middleware/route handler
    });
};

// --- API Routes (Authentication) ---

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        const passwordHash = await bcrypt.hash(password, 10); // Hash password
        const newUser = new User({ username, passwordHash });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully!', token, userId: newUser._id, username: newUser.username });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        // Include discord info in login response if present
        res.status(200).json({
            message: 'Login successful!',
            token,
            userId: user._id,
            username: user.username,
            discordId: user.discordId,
            discordUsername: user.discordUsername, // Include here
            discordDiscriminator: user.discordDiscriminator // Include here
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// --- API Routes (User Profile - Protected) ---
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        // Select all fields including discordUsername and discordDiscriminator, excluding sensitive tokens
        const user = await User.findById(req.user.userId).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Update username
app.put('/api/profile/username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'New username is required.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== req.user.userId) {
            return res.status(409).json({ message: 'Username already taken by another user.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username },
            { new: true, runValidators: true }
        ).select('-passwordHash'); // Exclude hash for response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Re-issue token with new username to ensure frontend has latest data
        const token = jwt.sign({ userId: updatedUser._id, username: updatedUser.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Username updated successfully!', username: updatedUser.username, token });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Update password
app.put('/api/profile/password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new passwords are required.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Endpoint to explicitly link Discord ID to the currently authenticated Kanban user
app.post('/api/profile/link-discord', authenticateToken, async (req, res) => {
    try {
        const { discordId, discordUsername, discordDiscriminator } = req.body;
        if (!discordId || !discordUsername || !discordDiscriminator) {
            return res.status(400).json({ message: 'Discord ID, username, and discriminator are required for linking.' });
        }

        // Check if this Discord ID is already linked to another Kanban user
        const existingUserWithDiscordId = await User.findOne({ discordId: discordId });
        if (existingUserWithDiscordId && existingUserWithDiscordId._id.toString() !== req.user.userId) {
            return res.status(409).json({ message: 'This Discord account is already linked to another Kanban user.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Kanban user not found.' });
        }

        user.discordId = discordId;
        user.discordUsername = discordUsername;
        user.discordDiscriminator = discordDiscriminator;
        await user.save();

        // Re-issue token with updated discordId and username/discriminator to ensure frontend has latest data
        const token = jwt.sign(
            { userId: user._id, username: user.username, discordId: user.discordId, discordUsername: user.discordUsername, discordDiscriminator: user.discordDiscriminator },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Discord account linked successfully!',
            discordId: user.discordId,
            discordUsername: user.discordUsername,
            discordDiscriminator: user.discordDiscriminator,
            token
        });

    } catch (error) {
        console.error('Error linking Discord account:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// --- Discord OAuth Routes ---

// Step 1: Redirect to Discord for authorization
app.get('/api/discord/login', authenticateToken, (req, res) => {
    if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) {
        return res.status(500).json({ message: "Discord API credentials or scopes not configured on server." });
    }
    // Pass the Kanban user's ID as a state parameter
    const state = req.user.userId; // This is the Kanban user ID
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}&state=${encodeURIComponent(state)}`;
    res.json({ redirectUrl: discordAuthUrl });
});

// Step 2: Discord redirects back to this endpoint with a code
// CRITICAL FIX: Removed 'authenticateToken' middleware from this route
app.get('/api/discord/callback', async (req, res) => {
    const { code, state, error: discordError, error_description } = req.query; // Capture state and potential Discord errors

    if (discordError) {
        console.error('Discord OAuth error from Discord:', discordError, error_description);
        return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent(error_description || discordError || 'Discord authorization denied or failed.')}`);
    }

    if (!code) {
        // User might have denied the authorization
        return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent('Discord authorization denied or no code provided.')}`);
    }

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) {
        return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent('Server Discord credentials missing. Cannot complete OAuth.')}`);
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: DISCORD_REDIRECT_URI,
                scope: DISCORD_SCOPES,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Error exchanging Discord code for token:', errorData);
            throw new Error(`Failed to exchange code: ${errorData.error_description || errorData.message || 'Unknown error.'}`);
        }
        const tokenData = await tokenResponse.json();

        // Use the access token to get user info (specifically the Discord user ID)
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            console.error('Error fetching Discord user info:', errorData);
            throw new Error(`Failed to fetch Discord user: ${errorData.message || 'Unknown error.'}`);
        }
        const discordUser = await userResponse.json();
        const discordUserId = discordUser.id; // Get the Discord user ID
        const discordUsername = discordUser.username; // Get Discord username
        const discordDiscriminator = discordUser.discriminator; // Get Discord discriminator

        // Now, attempt to link this Discord ID to the Kanban user who initiated the flow (from 'state')
        let kanbanUserIdFromState = null;
        if (state) {
            try {
                kanbanUserIdFromState = decodeURIComponent(state); // Kanban userId passed as state
            } catch (e) {
                console.warn('Could not decode state parameter:', e);
            }
        }
        console.log(`Discord callback: Discord User ID: ${discordUserId}, Kanban User ID from state: ${kanbanUserIdFromState}`);

        let message = '';
        let kanbanUser = null;

        if (kanbanUserIdFromState) {
            // A Kanban user ID was passed in the state. Try to link it.
            kanbanUser = await User.findById(kanbanUserIdFromState);
            if (kanbanUser) {
                if (kanbanUser.discordId && kanbanUser.discordId !== discordUserId) {
                    message = 'This Kanban account is already linked to a different Discord account.';
                    console.warn(`Discord link conflict: Kanban user ${kanbanUser.username} already linked to ${kanbanUser.discordId}, but tried to link to ${discordUserId}.`);
                    return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
                }

                const existingLinkToThisDiscord = await User.findOne({ discordId: discordUserId });
                if (existingLinkToThisDiscord && existingLinkToThisDiscord._id.toString() !== kanbanUserIdFromState) {
                     message = `This Discord account (${discordUsername}#${discordDiscriminator}) is already linked to another Kanban user.`;
                     console.warn(`Discord account ${discordUserId} already linked to another Kanban user (${existingLinkToThisDiscord._id}).`);
                     return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
                }


                kanbanUser.discordId = discordUserId;
                kanbanUser.discordUsername = discordUsername; // Save Discord username
                kanbanUser.discordDiscriminator = discordDiscriminator; // Save Discord discriminator
                // Save Discord access and refresh tokens for future use (e.g., sending messages)
                kanbanUser.discordAccessToken = tokenData.access_token;
                kanbanUser.discordRefreshToken = tokenData.refresh_token;
                kanbanUser.discordExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000); // expires_in is in seconds
                await kanbanUser.save();
                message = `Discord account successfully linked: ${discordUsername}#${discordDiscriminator}.`;

                // Re-issue a fresh Kanban JWT to include the new discordId
                const newKanbanToken = jwt.sign(
                    { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                // Pass discord username and discriminator in redirect
                return res.redirect(`http://localhost:3000/?discord_connect_status=success&message=${encodeURIComponent(message)}&token=${newKanbanToken}&discord_username=${encodeURIComponent(discordUsername)}&discord_discriminator=${encodeURIComponent(discordDiscriminator)}`);

            } else {
                // Kanban user from state not found (e.g., deleted during Discord auth)
                message = 'Your Kanban account could not be found. Please log in and try linking again.';
                console.warn(`Discord callback: Kanban User ID from state (${kanbanUserIdFromState}) not found.`);
                return res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
            }
        } else {
            // No Kanban user ID in state, or state was invalid.
            // Check if this Discord ID is already associated with *any* Kanban user.
            kanbanUser = await User.findOne({ discordId: discordUserId });
            if (kanbanUser) {
                // Discord user found, but no explicit Kanban user ID was passed to link.
                // Log them into this Kanban account.
                const newKanbanToken = jwt.sign(
                    { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                message = `Welcome back, ${kanbanUser.username}! Your Discord account (${discordUsername}#${discordDiscriminator}) is already linked.`;
                // Pass discord username and discriminator in redirect
                return res.redirect(`http://localhost:3000/?discord_connect_status=success&message=${encodeURIComponent(message)}&token=${newKanbanToken}&discord_username=${encodeURIComponent(discordUsername)}&discord_discriminator=${encodeURIComponent(discordDiscriminator)}`);
            } else {
                // Discord account is not linked to any Kanban user yet.
                message = `Discord account (${discordUsername}#${discordDiscriminator}) fetched. Please log in to your Kanban account or register, then connect from settings.`;
                // Pass discord username and discriminator in redirect for informational message
                return res.redirect(`http://localhost:3000/?discord_connect_status=info&message=${encodeURIComponent(message)}&discord_username=${encodeURIComponent(discordUsername)}&discord_discriminator=${encodeURIComponent(discordDiscriminator)}`);
            }
        }

    } catch (error) {
        console.error('Discord OAuth callback error:', error);
        res.redirect(`http://localhost:3000/?discord_connect_status=error&message=${encodeURIComponent(error.message || 'An unknown error occurred during Discord connection.')}`);
    }
});


// --- API Routes (Categories - Protected) ---

// GET all categories for the authenticated user
app.get('/api/categories', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.userId }).sort({ createdAt: 1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// POST a new category for the authenticated user
app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const existingCategory = await Category.findOne({ name, userId: req.user.userId });
        if (existingCategory) {
            return res.status(409).json({ message: 'Category with this name already exists for this user.' });
        }

        const newCategory = new Category({ name, userId: req.user.userId });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// DELETE a category for the authenticated user (and associated cards)
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found or not owned by user.' });
        }

        // Also delete all cards in this category for this user
        await Card.deleteMany({ category: deletedCategory.name, userId: req.user.userId });

        res.status(200).json({ message: 'Category and associated cards deleted successfully!' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format.' });
        }
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// --- API Routes (Cards - Protected) ---

// GET all cards for the authenticated user
app.get('/api/cards', authenticateToken, async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.user.userId }).sort({ createdAt: 1 });
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Error fetching cards', error: error.message });
    }
});

// POST a new card for the authenticated user
app.post('/api/cards', authenticateToken, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Missing required fields: title, description, or category.' });
        }

        // Ensure the category exists for this user
        const categoryExists = await Category.findOne({ name: category, userId: req.user.userId });
        if (!categoryExists) {
            return res.status(400).json({ message: 'Specified category does not exist for this user.' });
        }

        const newCard = new Card({ title, description, category, userId: req.user.userId });
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// PUT (update) a card by ID for the authenticated user
app.put('/api/cards/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.category !== undefined) {
            // If category is being updated, ensure the new category exists for this user
            const newCategoryName = req.body.category;
            const categoryExists = await Category.findOne({ name: newCategoryName, userId: req.user.userId });
            if (!categoryExists) {
                return res.status(400).json({ message: 'Cannot move to a category that does not exist for this user.' });
            }
            updates.category = newCategoryName;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update.' });
        }

        const updatedCard = await Card.findOneAndUpdate(
            { _id: id, userId: req.user.userId }, // Find by ID and userId
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found or not owned by user.' });
        }

        res.status(200).json(updatedCard);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID format.' });
        }
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// DELETE a card by ID for the authenticated user
app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await Card.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found or not owned by user.' });
            }

        res.status(200).json({ message: 'Card deleted successfully!' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID format.' });
        }
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Frontend accessible via public/index.html`);
  console.log(`Discord OAuth Redirect URI: ${DISCORD_REDIRECT_URI}`);
});
