// require('dotenv').config(); // THIS MUST BE THE VERY FIRST LINE

// // --- INITIAL ENVIRONMENT VARIABLES CHECK ---
// // This part ensures dotenv is loading variables.
// // If you see "NOT LOADED" here, your .env file is still not being read correctly.
// console.log('--- Initial Environment Variables Check ---');
// console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID ? 'Loaded' : 'NOT LOADED');
// console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'Loaded' : 'NOT LOADED');
// console.log('DISCORD_REDIRECT_URI:', process.env.DISCORD_REDIRECT_URI || 'Not Set, using default');
// console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');
// console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not Set, using default (local)'); // New check
// console.log('-----------------------------------------');
// // --- END INITIAL ENVIRONMENT VARIABLES CHECK ---


// // Import necessary modules
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs'); // For password hashing
// const jwt = require('jsonwebtoken'); // For JSON Web Tokens
// // CRITICAL FIX: Changed import for node-fetch to correctly get the 'fetch' function
// const { default: fetch } = require('node-fetch'); // For making HTTP requests from Node.js

// // Import Mongoose Models from separate files
// // Updated User model definition to include discordUsername and discordDiscriminator
// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },
//     discordId: { type: String, unique: true, sparse: true }, // Add sparse for unique index that allows nulls
//     discordUsername: { type: String }, // Store Discord username
//     discordDiscriminator: { type: String }, // Store Discord discriminator (e.g., #1234)
//     discordAccessToken: { type: String, select: false }, // Store for future API calls, but don't return by default
//     discordRefreshToken: { type: String, select: false },
//     discordExpiresAt: { type: Date, select: false },
//     createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', UserSchema);

// const Category = require('./models/category'); // Assuming category and card models are stable
// const Card = require('./models/card');

// const app = express();
// // FIX: Use process.env.PORT for Render deployment, fallback to 3000 for local development
// const port = process.env.PORT || 3000;

// // --- Configuration ---
// const MONGODB_URI = 'mongodb+srv://georgeortman19:9c5qdSpwHAUY4HMF@cluster0.zrxpezv.mongodb.net/'; // Your MongoDB URI - IMPORTANT: Ensure this is your correct MongoDB Atlas URI

// // Ensure JWT_SECRET is always a string. If process.env.JWT_SECRET is undefined, throw an error immediately.
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) { // Add length check for robustness
//     console.error("FATAL ERROR: JWT_SECRET environment variable is missing, not a string, or too short.");
//     console.error("Please set a strong JWT_SECRET in your .env file (e.g., use a tool to generate a random 32-character string).");
//     process.exit(1); // Exit the process as we cannot proceed securely without a JWT secret
// }

// // Discord OAuth Configuration (robustly check and set defaults/exit if critical)
// const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
// const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
// // *** CRITICAL FIX HERE ***: Ensure this URL matches your Render deployment and Discord Dev Portal exactly.
// // Default to your known Render URL if env var is not set.
// const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://taskfllow.onrender.com/api/discord/callback';
// const DISCORD_SCOPES = 'identify'; // We only need 'identify' for basic user info (Discord ID)

// // *** CRITICAL FIX HERE ***: Define the frontend URL for redirects after Discord OAuth
// // Default to your known Render URL if env var is not set.
// const FRONTEND_URL = process.env.FRONTEND_URL || 'https://taskfllow.onrender.com';


// if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
//     console.warn("WARNING: Discord Client ID or Secret not fully configured. Discord integration may not work.");
//     // No process.exit here as the core app can still function without Discord integration.
// }


// // --- MongoDB Connection ---
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully!'))
//   .catch(err => {
//       console.error('MongoDB connection error:', err);
//       process.exit(1); // Exit if DB connection fails, as app is unusable
//   });

// // --- Middleware ---
// app.use(cors()); // Enable CORS for frontend communication
// app.use(express.json()); // Parse JSON bodies
// app.use(express.static('public')); // Serve static files (where your HTML/CSS/JS will be)

// // --- Authentication Middleware (Highly Instrumented) ---
// const authenticateToken = (req, res, next) => {
//     console.log('\n--- AUTHENTICATION MIDDLEWARE START ---');
//     const authHeader = req.headers['authorization'];
//     console.log('1. Authorization Header Received:', authHeader);

//     // Check if the header is missing entirely
//     if (!authHeader) {
//         console.log('2. No Authorization header found. Returning 401.');
//         return res.status(401).json({ message: 'Authentication token required.' });
//     }

//     // Extract the token (expecting "Bearer TOKEN_STRING")
//     const token = authHeader.split(' ')[1]; // Get the part after "Bearer "
//     console.log('3. Extracted Token:', token ? 'Token present (not null/undefined)' : 'Token missing after "Bearer "');
//     // console.log('3a. Full Extracted Token:', token); // Uncomment this line if you want to see the token itself (BE CAREFUL IN PRODUCTION)

//     // Check if the token string itself is missing after split
//     if (!token) {
//         console.log('4. Token string is empty or invalid format after split. Returning 401.');
//         return res.status(401).json({ message: 'Authentication token required (invalid format).' });
//     }

//     // Verify the token using the secret
//     console.log('5. Attempting to verify token with JWT_SECRET length:', JWT_SECRET.length);
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('6. JWT Verification FAILED!');
//             console.error('   Error Type:', err.name); // e.g., TokenExpiredError, JsonWebTokenError
//             console.error('   Error Message:', err.message); // e.g., "jwt expired", "invalid signature"
//             console.error('   Full Error Object:', err); // Log the full error for detailed debugging

//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
//             } else if (err.name === 'JsonWebTokenError') {
//                 return res.status(403).json({ message: 'Invalid authentication token. Please log in again.' });
//             } else {
//                 return res.status(403).json({ message: 'Authentication failed. Please log in again.' });
//             }
//         }

//         // If verification is successful
//         console.log('6. JWT Verification SUCCESS! User payload:', user);
//         req.user = user; // Attach decoded user payload to request
//         console.log('--- AUTHENTICATION MIDDLEWARE END (SUCCESS) ---');
//         next(); // Proceed to the next middleware/route handler
//     });
// };

// // --- API Routes (Authentication) ---

// // Register new user
// app.post('/api/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required.' });
//         }

//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(409).json({ message: 'Username already taken.' });
//         }

//         const passwordHash = await bcrypt.hash(password, 10); // Hash password
//         const newUser = new User({ username, passwordHash });
//         await newUser.save();

//         const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({ message: 'User registered successfully!', token, userId: newUser._id, username: newUser.username });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Login user
// app.post('/api/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required.' });
//         }

//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }

//         const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
//         // Include discord info in login response if present
//         res.status(200).json({
//             message: 'Login successful!',
//             token,
//             userId: user._id,
//             username: user.username,
//             discordId: user.discordId,
//             discordUsername: user.discordUsername, // Include here
//             discordDiscriminator: user.discordDiscriminator // Include here
//         });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // --- API Routes (User Profile - Protected) ---
// app.get('/api/profile', authenticateToken, async (req, res) => {
//     try {
//         // Select all fields including discordUsername and discordDiscriminator, excluding sensitive tokens
//         const user = await User.findById(req.user.userId).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Update username
// app.put('/api/profile/username', authenticateToken, async (req, res) => {
//     try {
//         const { username } = req.body;
//         if (!username) {
//             return res.status(400).json({ message: 'New username is required.' });
//         }

//         const existingUser = await User.findOne({ username });
//         if (existingUser && existingUser._id.toString() !== req.user.userId) {
//             return res.status(409).json({ message: 'Username already taken by another user.' });
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             req.user.userId,
//             { username },
//             { new: true, runValidators: true }
//         ).select('-passwordHash'); // Exclude hash for response

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found.' });
//         }
//         // Re-issue token with new username to ensure frontend has latest data
//         const token = jwt.sign({ userId: updatedUser._id, username: updatedUser.username }, JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ message: 'Username updated successfully!', username: updatedUser.username, token });
//     } catch (error) {
//         console.error('Error updating username:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Update password
// app.put('/api/profile/password', authenticateToken, async (req, res) => {
//     try {
//         const { oldPassword, newPassword } = req.body;
//         if (!oldPassword || !newPassword) {
//             return res.status(400).json({ message: 'Old and new passwords are required.' });
//         }

//         const user = await User.findById(req.user.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Incorrect old password.' });
//         }

//         user.passwordHash = await bcrypt.hash(newPassword, 10);
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully!' });
//     } catch (error) {
//         console.error('Error updating password:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// app.post('/api/profile/link-discord', authenticateToken, async (req, res) => {
//     try {
//         const { discordId, discordUsername, discordDiscriminator } = req.body;
//         if (!discordId || !discordUsername || !discordDiscriminator) {
//             return res.status(400).json({ message: 'Discord ID, username, and discriminator are required for linking.' });
//         }

//         const existingUserWithDiscordId = await User.findOne({ discordId: discordId });
//         if (existingUserWithDiscordId && existingUserWithDiscordId._id.toString() !== req.user.userId) {
//             return res.status(409).json({ message: 'This Discord account is already linked to another TaskFlow user.' });
//         }

//         const user = await User.findById(req.user.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'TaskFlow user not found.' });
//         }

//         user.discordId = discordId;
//         user.discordUsername = discordUsername;
//         user.discordDiscriminator = discordDiscriminator;
//         await user.save();

//         // Re-issue token with updated discordId and username/discriminator to ensure frontend has latest data
//         const token = jwt.sign(
//             { userId: user._id, username: user.username, discordId: user.discordId, discordUsername: user.discordUsername, discordDiscriminator: user.discordDiscriminator },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.status(200).json({
//             message: 'Discord account linked successfully!',
//             discordId: user.discordId,
//             discordUsername: user.discordUsername,
//             discordDiscriminator: user.discordDiscriminator,
//             token
//         });

//     } catch (error) {
//         console.error('Error linking Discord account:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });


// // --- Discord OAuth Routes ---

// // Step 1: Redirect to Discord for authorization
// app.get('/api/discord/login', authenticateToken, (req, res) => {
//     if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) {
//         return res.status(500).json({ message: "Discord API credentials or scopes not configured on server." });
//     }
//     const state = req.user.userId; 
//     const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}&state=${encodeURIComponent(state)}`;
//     res.json({ redirectUrl: discordAuthUrl });
// });

// // Step 2: Discord redirects back to this endpoint with a code
// // CRITICAL FIX: Removed 'authenticateToken' middleware from this route
// app.get('/api/discord/callback', async (req, res) => {
//     const { code, state, error: discordError, error_description } = req.query; // Capture state and potential Discord errors

//     if (discordError) {
//         console.error('Discord OAuth error from Discord:', discordError, error_description);
//         // FIX: Use FRONTEND_URL constant for redirect
//         return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(error_description || discordError || 'Discord authorization denied or failed.')}`);
//     }

//     if (!code) {
//         // User might have denied the authorization
//         // FIX: Use FRONTEND_URL constant for redirect
//         return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent('Discord authorization denied or no code provided.')}`);
//     }

//     if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) {
//         // FIX: Use FRONTEND_URL constant for redirect
//         return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent('Server Discord credentials missing. Cannot complete OAuth.')}`);
//     }

//     try {
//         // Exchange the code for an access token
//         const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 client_id: DISCORD_CLIENT_ID,
//                 client_secret: DISCORD_CLIENT_SECRET,
//                 grant_type: 'authorization_code',
//                 code: code,
//                 redirect_uri: DISCORD_REDIRECT_URI,
//                 scope: DISCORD_SCOPES,
//             }),
//         });

//         if (!tokenResponse.ok) {
//             const errorData = await tokenResponse.json();
//             console.error('Error exchanging Discord code for token:', errorData);
//             throw new Error(`Failed to exchange code: ${errorData.error_description || errorData.message || 'Unknown error.'}`);
//         }
//         const tokenData = await tokenResponse.json();

//         // Use the access token to get user info (specifically the Discord user ID)
//         const userResponse = await fetch('https://discord.com/api/users/@me', {
//             headers: {
//                 Authorization: `Bearer ${tokenData.access_token}`,
//             },
//         });

//         if (!userResponse.ok) {
//             const errorData = await userResponse.json();
//             console.error('Error fetching Discord user info:', errorData);
//             throw new Error(`Failed to fetch Discord user: ${errorData.message || 'Unknown error.'}`);
//         }
//         const discordUser = await userResponse.json();
//         const discordUserId = discordUser.id; // Get the Discord user ID
//         const discordUsername = discordUser.username; // Get Discord username
//         const discordDiscriminator = discordUser.discriminator; // Get Discord discriminator

//         let kanbanUserIdFromState = null;
//         if (state) {
//             try {
//                 kanbanUserIdFromState = decodeURIComponent(state); 
//             } catch (e) {
//                 console.warn('Could not decode state parameter:', e);
//             }
//         }
//         console.log(`Discord callback: Discord User ID: ${discordUserId}, Kanban User ID from state: ${kanbanUserIdFromState}`);

//         let message = '';
//         let kanbanUser = null;

//         if (kanbanUserIdFromState) {
//             // A Kanban user ID was passed in the state. Try to link it.
//             kanbanUser = await User.findById(kanbanUserIdFromState);
//             if (kanbanUser) {
//                 // Scenario 1: Kanban user already linked to THIS Discord ID (no change needed)
//                 if (kanbanUser.discordId === discordUserId) {
//                     message = `Discord account (${discordUsername}#${discordDiscriminator}) is already linked to your Kanban account.`;
//                     // Re-issue token with current data
//                     const token = jwt.sign(
//                         { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
//                         JWT_SECRET,
//                         { expiresIn: '1h' }
//                     );
//                     // FIX: Use FRONTEND_URL constant for redirect
//                     return res.redirect(`${FRONTEND_URL}/?discord_connect_status=info&message=${encodeURIComponent(message)}&token=${token}`);
//                 }

//                 // Scenario 2: Kanban user already linked to a *different* Discord ID
//                 if (kanbanUser.discordId && kanbanUser.discordId !== discordUserId) {
//                     message = `Your Kanban account is already linked to a different Discord account. Please unlink it first if you wish to connect this one.`;
//                     console.warn(`Discord link conflict: Kanban user ${kanbanUser.username} already linked to ${kanbanUser.discordId}, but tried to link to ${discordUserId}.`);
//                     // FIX: Use FRONTEND_URL constant for redirect
//                     return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
//                 }

//                 // Scenario 3: This Discord ID is already linked to a *different* Kanban user
//                 const existingLinkToThisDiscord = await User.findOne({ discordId: discordUserId });
//                 if (existingLinkToThisDiscord && existingLinkToThisDiscord._id.toString() !== kanbanUserIdFromState) {
//                     message = `This Discord account (${discordUsername}#${discordDiscriminator}) is already linked to another Kanban account.`;
//                     console.warn(`Discord link conflict: Discord ID ${discordUserId} already linked to Kanban user ${existingLinkToThisDiscord.username}, but tried to link to ${kanbanUser.username}.`);
//                     // FIX: Use FRONTEND_URL constant for redirect
//                     return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
//                 }

//                 // Scenario 4: Link new Discord ID to this Kanban user
//                 kanbanUser.discordId = discordUserId;
//                 kanbanUser.discordUsername = discordUsername;
//                 kanbanUser.discordDiscriminator = discordDiscriminator;
//                 kanbanUser.discordAccessToken = tokenData.access_token;
//                 kanbanUser.discordRefreshToken = tokenData.refresh_token;
//                 kanbanUser.discordExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000); // Expires in seconds
//                 await kanbanUser.save();
//                 message = 'Discord account linked successfully!';
//                 console.log(`Discord link successful: Kanban user ${kanbanUser.username} linked to Discord ID ${discordUserId}.`);

//                 // Re-issue token with updated discordId and username/discriminator
//                 const token = jwt.sign(
//                     { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
//                     JWT_SECRET,
//                     { expiresIn: '1h' }
//                 );
//                 // FIX: Use FRONTEND_URL constant for redirect
//                 return res.redirect(`${FRONTEND_URL}/?discord_connect_status=success&message=${encodeURIComponent(message)}&token=${token}&discord_username=${encodeURIComponent(discordUsername)}&discord_discriminator=${encodeURIComponent(discordDiscriminator)}`);
//             } else {
//                 // Kanban user not found for the provided state
//                 message = 'Could not find Kanban user for Discord linking. Please try again from the Kanban app.';
//                 console.warn(`Discord link failed: Kanban user ID ${kanbanUserIdFromState} from state not found.`);
//                 // FIX: Use FRONTEND_URL constant for redirect
//                 return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
//             }
//         } else {
//             // No Kanban user ID in state, meaning the flow wasn't initiated from the Kanban app's settings
//             message = 'Discord authentication successful, but Kanban user ID was not provided in the state. Please initiate Discord connection from your Kanban app\'s settings.';
//             console.warn('Discord callback: No Kanban user ID in state parameter.');
//             // FIX: Use FRONTEND_URL constant for redirect
//             return res.redirect(`${FRONTEND_URL}/?discord_connect_status=info&message=${encodeURIComponent(message)}`);
//         }
//     } catch (error) {
//         console.error('Discord OAuth callback processing error:', error);
//         // FIX: Use FRONTEND_URL constant for redirect
//         return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(`An error occurred during Discord connection: ${error.message}`)}`);
//     }
// });


// // --- Kanban Board API Routes (Protected) ---

// // Get all categories for the authenticated user
// app.get('/api/categories', authenticateToken, async (req, res) => {
//     try {
//         // Find categories belonging to the authenticated user
//         const categories = await Category.find({ userId: req.user.userId }).sort({ name: 1 });
//         res.status(200).json(categories);
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Create a new category
// app.post('/api/categories', authenticateToken, async (req, res) => {
//     try {
//         const { name } = req.body;
//         if (!name) {
//             return res.status(400).json({ message: 'Category name is required.' });
//         }

//         // Check for existing category with the same name for this user
//         const existingCategory = await Category.findOne({ name, userId: req.user.userId });
//         if (existingCategory) {
//             return res.status(409).json({ message: `Category with name '${name}' already exists.` });
//         }

//         const newCategory = new Category({
//             name,
//             userId: req.user.userId
//         });
//         await newCategory.save();
//         res.status(201).json({ message: 'Category created successfully!', category: newCategory });
//     } catch (error) {
//         console.error('Error creating category:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Delete a category and its associated cards
// app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find the category and ensure it belongs to the authenticated user
//         const category = await Category.findOneAndDelete({ _id: id, userId: req.user.userId });

//         if (!category) {
//             return res.status(404).json({ message: 'Category not found or you do not have permission to delete it.' });
//         }

//         // Delete all cards associated with this category and user
//         await Card.deleteMany({ category: category.name, userId: req.user.userId });

//         res.status(200).json({ message: 'Category and associated cards deleted successfully!' });
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });


// // Get all cards for the authenticated user
// app.get('/api/cards', authenticateToken, async (req, res) => {
//     try {
//         // Find cards belonging to the authenticated user
//         const cards = await Card.find({ userId: req.user.userId }).sort({ category: 1, createdAt: 1 });
//         res.status(200).json(cards);
//     } catch (error) {
//         console.error('Error fetching cards:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Create a new card
// app.post('/api/cards', authenticateToken, async (req, res) => {
//     try {
//         const { title, description, category } = req.body;
//         if (!title || !description || !category) {
//             return res.status(400).json({ message: 'Title, description, and category are required.' });
//         }

//         // Ensure the category exists and belongs to the user
//         const existingCategory = await Category.findOne({ name: category, userId: req.user.userId });
//         if (!existingCategory) {
//             return res.status(400).json({ message: `Category '${category}' not found or does not belong to you.` });
//         }

//         const newCard = new Card({
//             title,
//             description,
//             category, // Store category name
//             userId: req.user.userId
//         });
//         await newCard.save();
//         res.status(201).json({ message: 'Card created successfully!', card: newCard });
//     } catch (error) {
//         console.error('Error creating card:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Update a card
// app.put('/api/cards/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description, category } = req.body;

//         if (!title || !description || !category) {
//             return res.status(400).json({ message: 'Title, description, and category are required for update.' });
//         }

//         // Ensure the new category (if changed) exists and belongs to the user
//         const existingCategory = await Category.findOne({ name: category, userId: req.user.userId });
//         if (!existingCategory) {
//             return res.status(400).json({ message: `Category '${category}' not found or does not belong to you.` });
//         }

//         // Find the card and ensure it belongs to the authenticated user
//         const updatedCard = await Card.findOneAndUpdate(
//             { _id: id, userId: req.user.userId },
//             { title, description, category },
//             { new: true, runValidators: true } // Return the updated document and run schema validators
//         );

//         if (!updatedCard) {
//             return res.status(404).json({ message: 'Card not found or you do not have permission to update it.' });
//         }
//         res.status(200).json({ message: 'Card updated successfully!', card: updatedCard });
//     } catch (error) {
//         console.error('Error updating card:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// // Delete a card
// app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find the card and ensure it belongs to the authenticated user
//         const deletedCard = await Card.findOneAndDelete({ _id: id, userId: req.user.userId });

//         if (!deletedCard) {
//             return res.status(404).json({ message: 'Card not found or you do not have permission to delete it.' });
//         }
//         res.status(200).json({ message: 'Card deleted successfully!' });
//     } catch (error) {
//         console.error('Error deleting card:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });


// // --- Start Server ---
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//     // Log the actual URL where the server should be accessible for clarity in deployment logs
//     console.log(`Access backend API at: http://localhost:${port}/api (for local testing)`);
//     if (process.env.NODE_ENV === 'production') {
//         console.log(`For Render deployment, API will be at: ${FRONTEND_URL}/api`);
//     }
// });



require('dotenv').config(); // THIS MUST BE THE VERY FIRST LINE

// --- INITIAL ENVIRONMENT VARIABLES CHECK ---
console.log('--- Initial Environment Variables Check ---');
console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID ? 'Loaded' : 'NOT LOADED');
console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('DISCORD_REDIRECT_URI:', process.env.DISCORD_REDIRECT_URI || 'Not Set, using default');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not Set, using default (local)');
console.log('ADMIN_DISCORD_ID:', process.env.ADMIN_DISCORD_ID ? 'Loaded' : 'NOT SET - ADMIN PANEL WILL NOT BE ACTIVE'); // New check for admin ID
console.log('-----------------------------------------');


// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Tokens
const { default: fetch } = require('node-fetch'); // For making HTTP requests from Node.js

// Import Mongoose Models
// Ensure these paths are correct relative to server.js
const User = require('./models/user');
const Category = require('./models/category');
const Card = require('./models/card');

const app = express();
const port = process.env.PORT || 3000;

// --- Configuration ---
const MONGODB_URI = 'mongodb+srv://georgeortman19:9c5qdSpwHAUY4HMF@cluster0.zrxpezv.mongodb.net/'; // Your MongoDB URI - IMPORTANT: Ensure this is your correct MongoDB Atlas URI

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) {
    console.error("FATAL ERROR: JWT_SECRET environment variable is missing, not a string, or too short.");
    process.exit(1);
}

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://taskfllow.onrender.com/api/discord/callback';
const DISCORD_SCOPES = 'identify';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://taskfllow.onrender.com';

// *** NEW ADMIN CONFIGURATION ***
// Your specific Discord User ID that will have admin privileges
const ADMIN_DISCORD_ID = process.env.ADMIN_DISCORD_ID; // Loaded from environment variable

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.warn("WARNING: Discord Client ID or Secret not fully configured. Discord integration may not work.");
}
if (!ADMIN_DISCORD_ID) {
    console.warn("WARNING: ADMIN_DISCORD_ID environment variable is not set. Admin panel functionality will not be available.");
}


// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  });

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required (invalid format).' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid authentication token. Please log in again.' });
            } else {
                return res.status(403).json({ message: 'Authentication failed. Please log in again.' });
            }
        }
        req.user = user; // Attach decoded user payload to request
        next();
    });
};

// --- NEW ADMIN AUTHORIZATION MIDDLEWARE ---
const authorizeAdmin = async (req, res, next) => {
    // This middleware assumes `authenticateToken` has already run and `req.user` is populated.
    if (!req.user || !req.user.discordId) {
        return res.status(403).json({ message: 'Admin access denied: User not authenticated with Discord.' });
    }

    if (req.user.discordId !== ADMIN_DISCORD_ID) {
        console.warn(`Unauthorized admin access attempt by Discord ID: ${req.user.discordId}`);
        return res.status(403).json({ message: 'Admin access denied: You do not have sufficient permissions.' });
    }
    next();
};


// --- API Routes (Authentication) ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) { return res.status(400).json({ message: 'Username and password are required.' }); }

        const existingUser = await User.findOne({ username });
        if (existingUser) { return res.status(409).json({ message: 'Username already taken.' }); }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, passwordHash });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully!', token, userId: newUser._id, username: newUser.username });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) { return res.status(400).json({ message: 'Username and password are required.' }); }

        const user = await User.findOne({ username });
        if (!user) { return res.status(401).json({ message: 'Invalid credentials.' }); }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) { return res.status(401).json({ message: 'Invalid credentials.' }); }

        const token = jwt.sign({ userId: user._id, username: user.username, discordId: user.discordId, discordUsername: user.discordUsername, discordDiscriminator: user.discordDiscriminator }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful!',
            token,
            userId: user._id,
            username: user.username,
            discordId: user.discordId,
            discordUsername: user.discordUsername,
            discordDiscriminator: user.discordDiscriminator
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// --- API Routes (User Profile - Protected) ---
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/profile/username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) { return res.status(400).json({ message: 'New username is required.' }); }

        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== req.user.userId) {
            return res.status(409).json({ message: 'Username already taken by another user.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!updatedUser) { return res.status(404).json({ message: 'User not found.' }); }
        const token = jwt.sign({ userId: updatedUser._id, username: updatedUser.username, discordId: updatedUser.discordId, discordUsername: updatedUser.discordUsername, discordDiscriminator: updatedUser.discordDiscriminator }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Username updated successfully!', username: updatedUser.username, token });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/profile/password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) { return res.status(400).json({ message: 'Old and new passwords are required.' }); }

        const user = await User.findById(req.user.userId);
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) { return res.status(401).json({ message: 'Incorrect old password.' }); }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/profile/link-discord', authenticateToken, async (req, res) => {
    try {
        const { discordId, discordUsername, discordDiscriminator } = req.body;
        if (!discordId || !discordUsername || !discordDiscriminator) { return res.status(400).json({ message: 'Discord ID, username, and discriminator are required for linking.' }); }

        const existingUserWithDiscordId = await User.findOne({ discordId: discordId });
        if (existingUserWithDiscordId && existingUserWithDiscordId._id.toString() !== req.user.userId) {
            return res.status(409).json({ message: 'This Discord account is already linked to another Kanban user.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) { return res.status(404).json({ message: 'Kanban user not found.' }); }

        user.discordId = discordId;
        user.discordUsername = discordUsername;
        user.discordDiscriminator = discordDiscriminator;
        await user.save();

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
app.get('/api/discord/login', authenticateToken, (req, res) => {
    if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) { return res.status(500).json({ message: "Discord API credentials or scopes not configured on server." }); }
    const state = req.user.userId;
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}&state=${encodeURIComponent(state)}`;
    res.json({ redirectUrl: discordAuthUrl });
});

app.get('/api/discord/callback', async (req, res) => {
    const { code, state, error: discordError, error_description } = req.query;

    if (discordError) {
        console.error('Discord OAuth error from Discord:', discordError, error_description);
        return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(error_description || discordError || 'Discord authorization denied or failed.')}`);
    }

    if (!code) {
        return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent('Discord authorization denied or no code provided.')}`);
    }

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI || !DISCORD_SCOPES) {
        return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent('Server Discord credentials missing. Cannot complete OAuth.')}`);
    }

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            console.error('Error fetching Discord user info:', errorData);
            throw new Error(`Failed to fetch Discord user: ${errorData.message || 'Unknown error.'}`);
        }
        const discordUser = await userResponse.json();
        const discordUserId = discordUser.id;
        const discordUsername = discordUser.username;
        const discordDiscriminator = discordUser.discriminator;

        let message = '';
        let kanbanUser = null;

        if (state) {
            kanbanUserIdFromState = decodeURIComponent(state);
            kanbanUser = await User.findById(kanbanUserIdFromState);
            if (kanbanUser) {
                if (kanbanUser.discordId === discordUserId) {
                    message = `Discord account (${discordUsername}#${discordDiscriminator}) is already linked to your Kanban account.`;
                    const token = jwt.sign(
                        { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
                        JWT_SECRET, { expiresIn: '1h' }
                    );
                    return res.redirect(`${FRONTEND_URL}/?discord_connect_status=info&message=${encodeURIComponent(message)}&token=${token}`);
                }

                if (kanbanUser.discordId && kanbanUser.discordId !== discordUserId) {
                    message = `Your Kanban account is already linked to a different Discord account. Please unlink it first if you wish to connect this one.`;
                    return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
                }

                const existingLinkToThisDiscord = await User.findOne({ discordId: discordUserId });
                if (existingLinkToThisDiscord && existingLinkToThisDiscord._id.toString() !== kanbanUserIdFromState) {
                    message = `This Discord account (${discordUsername}#${discordDiscriminator}) is already linked to another Kanban account.`;
                    return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
                }

                kanbanUser.discordId = discordUserId;
                kanbanUser.discordUsername = discordUsername;
                kanbanUser.discordDiscriminator = discordDiscriminator;
                kanbanUser.discordAccessToken = tokenData.access_token;
                kanbanUser.discordRefreshToken = tokenData.refresh_token;
                kanbanUser.discordExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
                await kanbanUser.save();
                message = 'Discord account linked successfully!';
                const token = jwt.sign(
                    { userId: kanbanUser._id, username: kanbanUser.username, discordId: kanbanUser.discordId, discordUsername: kanbanUser.discordUsername, discordDiscriminator: kanbanUser.discordDiscriminator },
                    JWT_SECRET, { expiresIn: '1h' }
                );
                return res.redirect(`${FRONTEND_URL}/?discord_connect_status=success&message=${encodeURIComponent(message)}&token=${token}&discord_username=${encodeURIComponent(discordUsername)}&discord_discriminator=${encodeURIComponent(discordDiscriminator)}`);
            } else {
                message = 'Could not find Kanban user for Discord linking. Please try again from the Kanban app.';
                return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(message)}`);
            }
        } else {
            message = 'Discord authentication successful, but Kanban user ID was not provided in the state. Please initiate Discord connection from your Kanban app\'s settings.';
            return res.redirect(`${FRONTEND_URL}/?discord_connect_status=info&message=${encodeURIComponent(message)}`);
        }
    } catch (error) {
        console.error('Discord OAuth callback processing error:', error);
        return res.redirect(`${FRONTEND_URL}/?discord_connect_status=error&message=${encodeURIComponent(`An error occurred during Discord connection: ${error.message}`)}`);
    }
});


// --- Kanban Board API Routes (Protected) ---
app.get('/api/categories', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.userId }).sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) { return res.status(400).json({ message: 'Category name is required.' }); }
        const existingCategory = await Category.findOne({ name, userId: req.user.userId });
        if (existingCategory) { return res.status(409).json({ message: `Category with name '${name}' already exists.` }); }
        const newCategory = new Category({ name, userId: req.user.userId });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully!', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!category) { return res.status(404).json({ message: 'Category not found or you do not have permission to delete it.' }); }
        await Card.deleteMany({ category: category.name, userId: req.user.userId });
        res.status(200).json({ message: 'Category and associated cards deleted successfully!' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/cards', authenticateToken, async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.user.userId }).sort({ category: 1, createdAt: 1 });
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/cards', authenticateToken, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!title || !description || !category) { return res.status(400).json({ message: 'Title, description, and category are required.' }); }
        const existingCategory = await Category.findOne({ name: category, userId: req.user.userId });
        if (!existingCategory) { return res.status(400).json({ message: `Category '${category}' not found or does not belong to you.` }); }
        const newCard = new Card({ title, description, category, userId: req.user.userId });
        await newCard.save();
        res.status(201).json({ message: 'Card created successfully!', card: newCard });
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/cards/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;
        if (!title || !description || !category) { return res.status(400).json({ message: 'Title, description, and category are required for update.' }); }
        const existingCategory = await Category.findOne({ name: category, userId: req.user.userId });
        if (!existingCategory) { return res.status(400).json({ message: `Category '${category}' not found or does not belong to you.` }); }
        const updatedCard = await Card.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { title, description, category },
            { new: true, runValidators: true }
        );
        if (!updatedCard) { return res.status(404).json({ message: 'Card not found or you do not have permission to update it.' }); }
        res.status(200).json({ message: 'Card updated successfully!', card: updatedCard });
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await Card.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!deletedCard) { return res.status(404).json({ message: 'Card not found or you do not have permission to delete it.' }); }
        res.status(200).json({ message: 'Card deleted successfully!' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// --- NEW ADMIN API ROUTES (Protected by Admin Auth) ---

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        // Select all fields except passwordHash and sensitive Discord tokens
        const users = await User.find({}).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');
        res.status(200).json(users);
    } catch (error) {
        console.error('Admin: Error fetching all users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Get a specific user by their MongoDB _id (admin only)
app.get('/api/admin/user/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Admin: Error fetching user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Update another user's username (admin only)
app.put('/api/admin/user/:userId/username', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'New username is required.' });
        }

        const existingUserWithNewName = await User.findOne({ username });
        if (existingUserWithNewName && existingUserWithNewName._id.toString() !== userId) {
            return res.status(409).json({ message: 'Username already taken by another user.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true, runValidators: true }
        ).select('-passwordHash -discordAccessToken -discordRefreshToken -discordExpiresAt');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Username updated successfully!', user: updatedUser });
    } catch (error) {
        console.error(`Admin: Error updating username for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Reset another user's password (admin only)
app.put('/api/admin/user/:userId/password', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully for user.' });
    } catch (error) {
        console.error(`Admin: Error resetting password for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Delete another user (admin only)
app.delete('/api/admin/user/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure admin cannot delete themselves
        if (req.user.userId === userId) {
            return res.status(403).json({ message: 'Admin cannot delete their own account via admin panel.' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Delete all associated categories and cards for the deleted user
        await Category.deleteMany({ userId: deletedUser._id });
        await Card.deleteMany({ userId: deletedUser._id });

        res.status(200).json({ message: 'User and all associated data deleted successfully!' });
    } catch (error) {
        console.error(`Admin: Error deleting user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Get categories for a specific user (admin only)
app.get('/api/admin/user/:userId/categories', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const categories = await Category.find({ userId: userId }).sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error(`Admin: Error fetching categories for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Create a category for a specific user (admin only)
app.post('/api/admin/user/:userId/categories', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { name } = req.body;
        if (!name) { return res.status(400).json({ message: 'Category name is required.' }); }

        const existingCategory = await Category.findOne({ name, userId: userId });
        if (existingCategory) { return res.status(409).json({ message: `Category with name '${name}' already exists for this user.` }); }

        const newCategory = new Category({ name, userId: userId });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully!', category: newCategory });
    } catch (error) {
        console.error(`Admin: Error creating category for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Delete a category for a specific user (admin only)
app.delete('/api/admin/user/:userId/categories/:categoryId', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId, categoryId } = req.params;
        const category = await Category.findOneAndDelete({ _id: categoryId, userId: userId });
        if (!category) { return res.status(404).json({ message: 'Category not found or does not belong to this user.' }); }
        await Card.deleteMany({ category: category.name, userId: userId });
        res.status(200).json({ message: 'Category and associated cards deleted successfully!' });
    } catch (error) {
        console.error(`Admin: Error deleting category for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Get cards for a specific user (admin only)
app.get('/api/admin/user/:userId/cards', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const cards = await Card.find({ userId: userId }).sort({ category: 1, createdAt: 1 });
        res.status(200).json(cards);
    } catch (error) {
        console.error(`Admin: Error fetching cards for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Create a card for a specific user (admin only)
app.post('/api/admin/user/:userId/cards', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, description, category } = req.body;
        if (!title || !description || !category) { return res.status(400).json({ message: 'Title, description, and category are required.' }); }
        const existingCategory = await Category.findOne({ name: category, userId: userId });
        if (!existingCategory) { return res.status(400).json({ message: `Category '${category}' not found for this user.` }); }
        const newCard = new Card({ title, description, category, userId: userId });
        await newCard.save();
        res.status(201).json({ message: 'Card created successfully!', card: newCard });
    } catch (error) {
        console.error(`Admin: Error creating card for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Update a card for a specific user (admin only)
app.put('/api/admin/user/:userId/cards/:cardId', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId, cardId } = req.params;
        const { title, description, category } = req.body;
        if (!title || !description || !category) { return res.status(400).json({ message: 'Title, description, and category are required for update.' }); }
        const existingCategory = await Category.findOne({ name: category, userId: userId });
        if (!existingCategory) { return res.status(400).json({ message: `Category '${category}' not found for this user.` }); }
        const updatedCard = await Card.findOneAndUpdate(
            { _id: cardId, userId: userId },
            { title, description, category },
            { new: true, runValidators: true }
        );
        if (!updatedCard) { return res.status(404).json({ message: 'Card not found or does not belong to this user.' }); }
        res.status(200).json({ message: 'Card updated successfully!', card: updatedCard });
    } catch (error) {
        console.error(`Admin: Error updating card for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Delete a card for a specific user (admin only)
app.delete('/api/admin/user/:userId/cards/:cardId', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { userId, cardId } = req.params;
        const deletedCard = await Card.findOneAndDelete({ _id: cardId, userId: userId });
        if (!deletedCard) { return res.status(404).json({ message: 'Card not found or does not belong to this user.' }); }
        res.status(200).json({ message: 'Card deleted successfully!' });
    } catch (error) {
        console.error(`Admin: Error deleting card for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access backend API at: http://localhost:${port}/api (for local testing)`);
    if (process.env.NODE_ENV === 'production') {
        console.log(`For Render deployment, API will be at: ${FRONTEND_URL}/api`);
    }
});
