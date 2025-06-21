// // --- Global DOM Element References (cached for performance) ---
// // *** CRITICAL FIX HERE ***: Ensure this URL points to your deployed Render backend API.
// // It should be your Render frontend URL + /api.
// const API_BASE_URL = 'https://taskfllow.onrender.com/api';

// const authView = document.getElementById('auth-view');
// const boardView = document.getElementById('board-view');

// const authForm = document.getElementById('auth-form');
// const authTitle = document.getElementById('auth-title');
// const authUsernameInput = document.getElementById('auth-username');
// const authPasswordInput = document.getElementById('auth-password');
// const authSubmitBtn = document.getElementById('auth-submit-btn');
// const authToggleLink = document.getElementById('auth-toggle-link');
// const authMessage = document.getElementById('auth-message');

// const welcomeUsernameSpan = document.getElementById('welcome-username');
// const logoutBtn = document.getElementById('logout-btn');
// const settingsBtn = document.getElementById('settings-btn');
// const appStatusMessage = document.getElementById('app-status-message');

// const kanbanBoardContainer = document.getElementById('kanban-board-container');
// const addCardBtn = document.getElementById('add-card-btn');
// const addCategoryBtn = document.getElementById('add-category-btn');

// // Modals
// const addCategoryModal = document.getElementById('add-category-modal');
// const addCategoryForm = document.getElementById('add-category-form');
// const newCategoryNameInput = document.getElementById('new-category-name');
// const addCategoryMessage = document.getElementById('add-category-message');

// const addEditCardModal = document.getElementById('add-edit-card-modal');
// const cardModalTitle = document.getElementById('card-modal-title');
// const cardForm = document.getElementById('card-form');
// const cardTitleInput = document.getElementById('card-title-input');
// const cardDescriptionInput = document.getElementById('card-description-input');
// const cardCategorySelect = document.getElementById('card-category-select');
// const cardSubmitBtn = document.getElementById('card-submit-btn');
// const cardFormMessage = document.getElementById('card-form-message');

// const settingsModal = document.getElementById('settings-modal');
// const settingsUsernameDisplay = document.getElementById('settings-username-display');
// const settingsUserIdDisplay = document.getElementById('settings-user-id-display');
// const settingsDiscordStatus = document.getElementById('settings-discord-status');
// const updateUsernameForm = document.getElementById('update-username-form');
// const settingsNewUsernameInput = document.getElementById('settings-new-username');
// const usernameUpdateMessage = document.getElementById('username-update-message');
// const updatePasswordForm = document.getElementById('update-password-form');
// const settingsOldPasswordInput = document.getElementById('settings-old-password');
// const settingsNewPasswordInput = document.getElementById('settings-new-password');
// const passwordUpdateMessage = document.getElementById('password-update-message');
// const connectDiscordBtn = document.getElementById('connect-discord-btn');
// const discordConnectMessage = document.getElementById('discord-connect-message');
// const settingsLogoutBtn = document.getElementById('settings-logout-btn');

// // NEW: Settings Tabs Elements
// const tabButtons = document.querySelectorAll('.tab-button');
// const tabContents = document.querySelectorAll('.tab-content');


// const confirmationModal = document.getElementById('confirmation-modal');
// const confirmationMessage = document.getElementById('confirmation-message');
// const confirmActionBtn = document.getElementById('confirm-action-btn');
// const cancelActionBtn = document.getElementById('cancel-action-btn');

// const cardOptionsMenu = document.getElementById('card-options-menu');
// const editCardMenuItem = document.getElementById('edit-card-menu-item');
// const deleteCardMenuItem = document.getElementById('delete-card-menu-item');


// // --- Global State Variables ---
// let currentAuthViewType = 'login'; // 'login' or 'register'
// let currentUser = null; // Stores { userId, username, discordId, discordUsername, discordDiscriminator }
// let categories = []; // Cache for current categories
// let cards = []; // Cache for current cards
// let currentEditingCardId = null; // ID of card being edited
// let currentConfirmationAction = null; // Stores the function to call on confirmation


// // --- Utility Functions ---

// /**
//  * Sets the authentication token in localStorage.
//  * @param {string} token - The JWT token.
//  */
// function setAuthToken(token) {
//     try {
//         localStorage.setItem('authToken', token);
//         console.log('setAuthToken: Token successfully saved to localStorage. Length:', token ? token.length : 0);
//     } catch (e) {
//         console.error('setAuthToken: Failed to save token to localStorage:', e);
//         showAppStatusMessage('Error: Could not save session. Please check browser settings (e.g., private mode, storage limits).', 'error', 0);
//     }
// }

// /**
//  * Gets the authentication token from localStorage.
//  * @returns {string|null} The JWT token or null if not found.
//  */
// function getAuthToken() {
//     try {
//         const token = localStorage.getItem('authToken');
//         console.log('getAuthToken: Retrieved token from localStorage. Is token present?', !!token, 'Length:', token ? token.length : 0);
//         return token;
//     } catch (e) {
//         console.error('getAuthToken: Failed to retrieve token from localStorage:', e);
//         // If localStorage itself is problematic, force logout visually
//         return null;
//     }
// }

// /**
//  * Removes the authentication token from localStorage.
//  */
// function removeAuthToken() {
//     try {
//         localStorage.removeItem('authToken');
//         currentUser = null; // Clear current user data
//         console.log('removeAuthToken: Token successfully removed from localStorage.');
//     } catch (e) {
//         console.error('removeAuthToken: Failed to remove token from localStorage:', e);
//     }
// }

// /**
//  * Displays a status/error message in the designated area.
//  * @param {HTMLElement} element - The DOM element to display the message in.
//  * @param {string} message - The message text.
//  * @param {string} type - 'success' or 'error'.
//  * @param {number} duration - How long the message should display in ms (0 for persistent).
//  */
// function showMessage(element, message, type = 'error', duration = 3000) {
//     element.textContent = message;
//     element.classList.remove('hidden', 'error-message', 'success-message', 'info-message'); // Clear previous types
//     if (type === 'error') {
//         element.classList.add('error-message');
//     } else if (type === 'success') {
//         element.classList.add('success-message');
//     } else {
//         element.classList.add('info-message');
//     }
//     element.classList.remove('hidden');

//     if (duration > 0) {
//         setTimeout(() => {
//             element.classList.add('hidden');
//             element.textContent = '';
//         }, duration);
//     }
// }

// /**
//  * Displays a modal with a fade-in animation.
//  * @param {HTMLElement} modalElement - The modal DOM element.
//  */
// function showModal(modalElement) {
//     modalElement.style.display = 'flex'; // Ensure display is not 'none' for animation to work
//     modalElement.classList.remove('hidden-fade'); // Remove fade-out class if present
//     modalElement.classList.add('visible'); // Trigger fade-in animation
// }

// /**
//  * Hides a modal with a fade-out animation.
//  * @param {HTMLElement} modalElement - The modal DOM element.
//  */
// function hideModal(modalElement) {
//     modalElement.classList.remove('visible');
//     modalElement.classList.add('hidden-fade'); // Trigger fade-out animation
//     // After animation, set display to none to remove from layout and improve accessibility
//     modalElement.addEventListener('animationend', function handler() {
//         modalElement.classList.remove('hidden-fade'); // Clean up animation class
//         modalElement.style.display = 'none'; // Fully hide the modal
//         modalElement.removeEventListener('animationend', handler); // Remove listener
//     }, { once: true }); // Ensure listener runs only once
// }


// // --- API Call Wrapper (Enhanced Error Handling and Logging) ---
// async function apiCall(endpoint, method = 'GET', data = null) {
//     console.log(`\napiCall: Initiating ${method} request to ${endpoint}`);
//     const token = getAuthToken(); // Always get the latest token right before the call

//     const headers = {
//         'Content-Type': 'application/json',
//     };
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//         // CRITICAL LOG: Log the actual header string being sent
//         console.log('apiCall: Authorization header being sent:', headers['Authorization']);
//     } else {
//         console.warn('apiCall: No token found for this request. Authorization header will NOT be sent.');
//     }

//     const config = {
//         method,
//         headers,
//     };
//     if (data) {
//         config.body = JSON.stringify(data);
//     }
//     console.log('apiCall: Fetch config:', config);

//     try {
//         const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
//         const responseData = await response.json();
//         console.log(`apiCall: Response status for ${endpoint}: ${response.status}`);
//         console.log('apiCall: Response Data:', responseData);

//         if (!response.ok) {
//             // Aggressive session handling for 401/403 (Authentication/Authorization errors)
//             if (response.status === 401 || response.status === 403) {
//                 console.warn(`apiCall: Received ${response.status}. Session invalid/expired. Forcing logout.`);
//                 removeAuthToken(); // Clear any existing invalid token
//                 setAppView('login'); // Force redirect to login
//                 showAppStatusMessage('Your session has expired or is invalid. Please log in or register again.', 'error', 0);
//             }
//             // For ALL other non-OK responses (e.g., 400 Bad Request, 404 Not Found, 409 Conflict),
//             // just throw the error with the message to be handled by the specific calling function.
//             // This is the key change to prevent logout on 409.
//             throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
//         }
//         return responseData;
//     } catch (error) {
//         console.error(`API Call Error (${method} ${endpoint}):`, error);
//         // Only re-throw the error here. The specific frontend functions (e.g., handleAuthSubmit, handleAddCategoryFormSubmit)
//         // are responsible for displaying appropriate messages based on the error.
//         throw error; // This re-throws the error to handleAddCategoryFormSubmit
//     }
// }


// // --- View Management ---

// /**
//  * Switches the active view of the application.
//  * @param {string} viewName - 'login', 'register', or 'board'.
//  */
// function setAppView(viewName) {
//     console.log('setAppView: Switching to view:', viewName);
//     // Hide all main views first
//     authView.classList.add('hidden');
//     boardView.classList.add('hidden');

//     if (viewName === 'board') {
//         boardView.classList.remove('hidden');
//         // IMPORTANT: Data fetching will now happen *after* the view is set via loadBoardDataAndRender()
//     } else {
//         authView.classList.remove('hidden');
//         if (viewName === 'login') {
//             currentAuthViewType = 'login';
//             authTitle.textContent = 'Login';
//             authSubmitBtn.textContent = 'Login';
//             authToggleLink.textContent = 'Register here.';
//         } else { // register
//             currentAuthViewType = 'register';
//             authTitle.textContent = 'Create Account';
//             authSubmitBtn.textContent = 'Register';
//             authToggleLink.textContent = 'Login here.';
//         }
//         authForm.reset(); // Clear form fields
//         authMessage.classList.add('hidden'); // Hide any previous auth messages
//     }
// }

// /**
//  * Loads board data and handles Discord callback parameters.
//  * Called specifically after successful login/registration or on initial page load if authenticated.
//  */
// async function loadBoardDataAndRender() {
//     console.log('--- ENTERING loadBoardDataAndRender --- Starting board data load and Discord param check.');
//     const urlParams = new URLSearchParams(window.location.search);
//     const discordStatus = urlParams.get('discord_connect_status');
//     const discordMessage = urlParams.get('message');
//     const discordToken = urlParams.get('token'); // Check for token from Discord callback
//     const discordUsername = urlParams.get('discord_username'); // New: Get Discord username
//     const discordDiscriminator = urlParams.get('discord_discriminator'); // New: Get Discord discriminator

//     if (discordStatus) {
//         console.log('loadBoardDataAndRender: Discord callback parameters detected.');
//         const statusType = discordStatus === 'success' ? 'success' : (discordStatus === 'info' ? 'info' : 'error');
//         let displayMessage = decodeURIComponent(discordMessage || 'Unknown status.');

//         if (discordToken) {
//             console.log('loadBoardDataAndRender: Received new token from Discord callback. Logging in with it.');
//             setAuthToken(discordToken);
//             // After setting token, re-check auth to update currentUser and fetch board
//             await checkAuthAndRender();
//         }

//         // Refined message creation
//         if (discordStatus === 'success' && discordUsername && discordDiscriminator) {
//             displayMessage = `Successfully connected Discord: ${decodeURIComponent(discordUsername)}#${decodeURIComponent(discordDiscriminator)}. (You can manage this in settings).`;
//         } else if (discordMessage) {
//             displayMessage = decodeURIComponent(discordMessage);
//         }

//         showAppStatusMessage(`Discord Connection: ${displayMessage}`, statusType);
//         // Clean up URL parameters after processing
//         window.history.replaceState({}, document.title, window.location.pathname);
//         return; // Exit early if Discord params were processed and a token was handled
//     }

//     // Only proceed to fetch categories and cards if no special Discord login just happened
//     await fetchCategoriesAndCards();
//     console.log('loadBoardDataAndRender: Board data loaded and rendered.');
// }


// // --- Authentication Logic ---

// async function handleAuthSubmit(event) {
//     event.preventDefault();
//     console.log('--- ENTERING handleAuthSubmit --- Form submission for', currentAuthViewType);
//     showMessage(authMessage, '', 'hidden', 0); // Hide previous message

//     const username = authUsernameInput.value.trim();
//     const password = authPasswordInput.value.trim();

//     if (!username || !password) {
//         showMessage(authMessage, 'Please enter both username and password.', 'error');
//         return;
//     }

//     let endpoint = currentAuthViewType === 'register' ? '/register' : '/login';

//     try {
//         const data = await apiCall(endpoint, 'POST', { username, password });
//         console.log('handleAuthSubmit: API call successful, received data:', data);
//         setAuthToken(data.token); // Save the received token
//         currentUser = {
//             userId: data.userId,
//             username: data.username,
//             discordId: data.discordId,
//             discordUsername: data.discordUsername, // Assign from login response
//             discordDiscriminator: data.discordDiscriminator // Assign from login response
//         };
//         welcomeUsernameSpan.textContent = data.username; // Update welcome message

//         setAppView('board'); // Switch view to board
//         // Add a small delay before loading board data to ensure DOM is ready
//         setTimeout(loadBoardDataAndRender, 100); // 100ms delay
//     } catch (error) {
//         showMessage(authMessage, error.message, 'error');
//     }
// }

// async function checkAuthAndRender() {
//     console.log('--- ENTERING checkAuthAndRender --- Starting authentication check on page load.');
//     const token = getAuthToken();

//     if (token) {
//         console.log('checkAuthAndRender: Token found, attempting to fetch user profile.');
//         try {
//             const userProfile = await apiCall('/profile');
//             // Ensure currentUser is fully populated, including Discord details from profile
//             currentUser = {
//                 userId: userProfile._id, // Ensure _id is mapped to userId
//                 username: userProfile.username,
//                 discordId: userProfile.discordId,
//                 discordUsername: userProfile.discordUsername,
//                 discordDiscriminator: userProfile.discordDiscriminator
//             };
//             welcomeUsernameSpan.textContent = userProfile.username;
//             console.log('checkAuthAndRender: User profile fetched successfully:', userProfile);

//             setAppView('board'); // Switch view to board
//             setTimeout(loadBoardDataAndRender, 100);
//         } catch (error) {
//             console.error("checkAuthAndRender: Initial profile fetch failed, app should be redirecting to login:", error);
//             // The apiCall function itself handles the logout and redirect for 401/403 errors,
//             // so we just catch and let it do its job here.
//             // No explicit removeAuthToken() or setAppView('login') here to avoid double-handling.
//         }
//     } else {
//         console.log('checkAuthAndRender: No token found on startup. Ensuring clean state and setting app view to login.');
//         removeAuthToken();
//         setAppView('login');
//         showAppStatusMessage('No active session found. Please log in or register.', 'info', 0);
//     }
// }

// function logoutUser() {
//     console.log('logoutUser: Initiating logout process.');
//     removeAuthToken();
//     setAppView('login');
//     showAppStatusMessage('Logged out successfully.', 'success');
// }

// // --- User Profile/Settings Logic ---

// // NEW: Function to handle tab switching in settings modal
// function switchSettingsTab(tabId) {
//     console.log('switchSettingsTab: Activating tab:', tabId);
//     // Deactivate all tab buttons and hide all tab contents
//     tabButtons.forEach(button => button.classList.remove('active'));
//     tabContents.forEach(content => {
//         content.classList.remove('active-tab-content'); // Remove animation class
//         content.classList.add('hidden'); // Hide immediately
//     });

//     // Activate the clicked tab button
//     const targetButton = document.querySelector(`.tab-button[data-tab-id="${tabId}"]`);
//     if (targetButton) {
//         targetButton.classList.add('active');
//     }

//     // Show the corresponding tab content and add animation class
//     const targetContent = document.getElementById(tabId);
//     if (targetContent) {
//         targetContent.classList.remove('hidden'); // Show content first
//         // Trigger reflow to ensure animation restarts if changing between tabs quickly
//         void targetContent.offsetWidth; 
//         targetContent.classList.add('active-tab-content'); // Add animation class
//     }
// }


// async function renderSettingsModal() {
//     console.log('renderSettingsModal: Opening settings modal.');
//     if (!currentUser) {
//         console.error('renderSettingsModal: No current user data, cannot render settings.');
//         showAppStatusMessage('Error: User data not loaded. Please log in.', 'error');
//         return;
//     }

//     // Fetch latest user profile data in case it changed (e.g. Discord connect happened in another tab)
//     try {
//         const updatedUser = await apiCall('/profile');
//         // Update currentUser with latest fetched data
//         currentUser = {
//             userId: updatedUser._id,
//             username: updatedUser.username,
//             discordId: updatedUser.discordId,
//             discordUsername: updatedUser.discordUsername,
//             discordDiscriminator: updatedUser.discordDiscriminator
//         };
//         console.log('renderSettingsModal: User profile refreshed successfully:', currentUser);
//     } catch (error) {
//         console.error('renderSettingsModal: Error refreshing profile data:', error);
//         showAppStatusMessage(`Error refreshing profile data: ${error.message}`, 'error');
//         // If profile refresh fails, the apiCall already attempts to log out if it's a 401/403
//         // If not, we might want to just return and keep the current view.
//         return;
//     }

//     settingsUsernameDisplay.textContent = currentUser.username;
//     // FIX: Ensure userId is displayed correctly from currentUser.userId
//     settingsUserIdDisplay.textContent = currentUser.userId || 'N/A';

//     if (currentUser.discordId) {
//         let discordDisplayName = '';
//         if (currentUser.discordUsername && currentUser.discordDiscriminator) {
//             // Display Discord username#discriminator if available
//             discordDisplayName = `${currentUser.discordUsername}#${currentUser.discordDiscriminator}`;
//         } else {
//             // Fallback to just Discord ID if username/discriminator not available for some reason
//             discordDisplayName = currentUser.discordId;
//         }
//         settingsDiscordStatus.textContent = `Discord Connected: ${discordDisplayName}`;
//         settingsDiscordStatus.classList.remove('text-red-400');
//         settingsDiscordStatus.classList.add('text-green-400', 'settings-discord-status'); // Add specific class for styling
//         connectDiscordBtn.textContent = 'Discord Connected';
//         connectDiscordBtn.disabled = true;
//     } else {
//         settingsDiscordStatus.textContent = 'Discord Not Connected';
//         settingsDiscordStatus.classList.remove('text-green-400');
//         settingsDiscordStatus.classList.add('text-red-400', 'settings-discord-status'); // Add specific class for styling
//         connectDiscordBtn.textContent = 'Connect Discord';
//         connectDiscordBtn.disabled = false;
//     }

//     // Clear messages for all settings forms
//     showMessage(usernameUpdateMessage, '', 'hidden', 0);
//     showMessage(passwordUpdateMessage, '', 'hidden', 0);
//     showMessage(discordConnectMessage, '', 'hidden', 0);

//     settingsNewUsernameInput.value = currentUser.username;
//     settingsOldPasswordInput.value = '';
//     settingsNewPasswordInput.value = '';

//     // NEW: Activate the default tab when showing the modal
//     switchSettingsTab('account-info-tab'); // Default to Account Info tab

//     showModal(settingsModal);
// }

// async function handleUpdateUsername(event) {
//     event.preventDefault();
//     console.log('handleUpdateUsername: Updating username.');
//     showMessage(usernameUpdateMessage, '', 'hidden', 0);

//     const newUsername = settingsNewUsernameInput.value.trim();
//     if (!newUsername) {
//         showMessage(usernameUpdateMessage, 'New username cannot be empty.', 'error');
//         return;
//     }
//     if (newUsername === currentUser.username) {
//         showMessage(usernameUpdateMessage, 'Username is already up to date.', 'success');
//         return;
//     }

//     try {
//         const data = await apiCall('/profile/username', 'PUT', { username: newUsername });
//         setAuthToken(data.token);
//         currentUser.username = data.username;
//         welcomeUsernameSpan.textContent = data.username;
//         settingsUsernameDisplay.textContent = data.username;
//         showMessage(usernameUpdateMessage, 'Username updated successfully!', 'success');
//         console.log('handleUpdateUsername: Username updated successfully.');
//     } catch (error) {
//         console.error('handleUpdateUsername: Error updating username:', error);
//         showMessage(usernameUpdateMessage, error.message, 'error');
//     }
// }

// async function handleUpdatePassword(event) {
//     event.preventDefault();
//     console.log('handleUpdatePassword: Updating password.');
//     showMessage(passwordUpdateMessage, '', 'hidden', 0);

//     const oldPassword = settingsOldPasswordInput.value.trim();
//     const newPassword = settingsNewPasswordInput.value.trim();

//     if (!oldPassword || !newPassword) {
//         showMessage(passwordUpdateMessage, 'Both old and new passwords are required.', 'error');
//         return;
//     }
//     if (oldPassword === newPassword) {
//         showMessage(passwordUpdateMessage, 'New password cannot be the same as old password.', 'error');
//         return;
//     }

//     try {
//         await apiCall('/profile/password', 'PUT', { oldPassword, newPassword });
//         showMessage(passwordUpdateMessage, 'Password updated successfully!', 'success');
//         settingsOldPasswordInput.value = '';
//         settingsNewPasswordInput.value = '';
//         console.log('handleUpdatePassword: Password updated successfully.');
//     } catch (error) {
//         console.error('handleUpdatePassword: Error updating password:', error);
//         showMessage(passwordUpdateMessage, error.message, 'error');
//     }
// }

// async function handleConnectDiscord() {
//     console.log('handleConnectDiscord: Initiating Discord connection.');
//     showMessage(discordConnectMessage, '', 'hidden', 0);
//     try {
//         // This initiates the redirect to Discord OAuth
//         const data = await apiCall('/discord/login', 'GET');
//         console.log('handleConnectDiscord: Redirecting to Discord URL:', data.redirectUrl);
//         window.location.href = data.redirectUrl;
//     } catch (error) {
//         console.error('handleConnectDiscord: Error connecting Discord:', error);
//         showMessage(discordConnectMessage, error.message, 'error');
//     }
// }


// // --- Kanban Board Rendering ---

// async function fetchCategoriesAndCards() {
//     console.log('--- ENTERING fetchCategoriesAndCards --- Fetching categories and cards.');
//     showAppStatusMessage('Loading categories and cards...', 'info', 0);
//     try {
//         const fetchedCategories = await apiCall('/categories');
//         categories = fetchedCategories;
//         console.log('fetchCategoriesAndCards: Categories fetched:', categories);

//         const fetchedCards = await apiCall('/cards');
//         cards = fetchedCards;
//         console.log('fetchCategoriesAndCards: Cards fetched:', cards);

//         renderKanbanBoard();
//         updateAddCardButtonState();
//         showAppStatusMessage('Board loaded successfully.', 'success');
//     } catch (error) {
//         console.error('fetchCategoriesAndCards: Error loading board data:', error);
//         showAppStatusMessage(`Error loading board: ${error.message}. You might need to log in again.`, 'error', 0);
//     }
// }

// function renderKanbanBoard() {
//     console.log('renderKanbanBoard: Rendering Kanban board.');
//     kanbanBoardContainer.innerHTML = '';

//     if (categories.length === 0) {
//         console.log('renderKanbanBoard: No categories found, displaying message.');
//         const noCategoriesMessage = document.createElement('div');
//         noCategoriesMessage.className = 'text-center text-gray-500 text-lg w-full mt-10';
//         noCategoriesMessage.textContent = 'No categories yet! Click "Add Category" to get started.';
//         kanbanBoardContainer.appendChild(noCategoriesMessage);
//         return;
//     }

//     categories.forEach(category => {
//         const column = document.createElement('div');
//         column.classList.add('kanban-column');
//         column.dataset.category = category.name;
//         column.dataset.categoryId = category._id;

//         column.addEventListener('dragover', handleDragOver);
//         column.addEventListener('dragleave', handleDragLeave);
//         column.addEventListener('drop', handleDrop);

//         column.innerHTML = `
//             <div class="flex justify-between items-center mb-2">
//                 <h2>${category.name}</h2>
//                 <button class="text-red-400 hover:text-red-600 transition-colors delete-category-btn" data-category-id="${category._id}">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
//                 </button>
//             </div>
//             <div class="kanban-column-content">
//                 <!-- Cards will be injected here -->
//             </div>
//         `;
//         kanbanBoardContainer.appendChild(column);

//         const columnContent = column.querySelector('.kanban-column-content');
//         cards.filter(card => card.category === category.name).forEach(cardData => {
//             columnContent.appendChild(createCardElement(cardData));
//         });
//     });

//     document.querySelectorAll('.delete-category-btn').forEach(button => {
//         button.onclick = () => {
//             const categoryId = button.dataset.categoryId;
//             showConfirmation('Are you sure you want to delete this category? All cards in it will also be deleted.', () => handleDeleteCategory(categoryId));
//         };
//     });
//     console.log('renderKanbanBoard: Board rendering complete.');
// }

// /**
//  * Creates and returns a DOM element for a Kanban card.
//  * @param {Object} cardData - Object containing _id, title, description, category.
//  * @returns {HTMLElement} The created card div element.
//  */
// function createCardElement(cardData) {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     card.setAttribute('draggable', 'true');
//     card.dataset.id = cardData._id;
//     card.dataset.category = cardData.category;

//     card.innerHTML = `
//         <div class="card-header">
//             <h3>${cardData.title}</h3>
//             <button class="options-btn" data-id="${cardData._id}">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
//             </button>
//         </div>
//         <p>${cardData.description}</p>
//     `;

//     card.addEventListener('dragstart', handleDragStart);
//     card.addEventListener('dragend', handleDragEnd);

//     const optionsButton = card.querySelector('.options-btn');
//     optionsButton.addEventListener('click', (e) => {
//         e.stopPropagation();
//         showCardOptionsMenu(cardData, optionsButton);
//     });

//     return card;
// }

// /**
//  * Shows the main app status message at the top of the board.
//  * @param {string} message
//  * @param {string} type - 'success', 'error', 'info'
//  * @param {number} [duration=3000] - Duration in ms, 0 for permanent
//  */
// function showAppStatusMessage(message, type = 'info', duration = 3000) {
//     appStatusMessage.textContent = message;
//     appStatusMessage.className = `text-center p-3 rounded-lg mb-4`;
//     if (type === 'error') {
//         appStatusMessage.classList.add('bg-red-700', 'text-white');
//     } else if (type === 'success') {
//         appStatusMessage.classList.add('bg-green-700', 'text-white');
//     } else {
//         appStatusMessage.classList.add('bg-blue-700', 'text-white');
//     }
//     appStatusMessage.classList.remove('hidden', 'fade-out');
//     appStatusMessage.style.opacity = '1';

//     if (duration > 0) {
//         setTimeout(() => {
//             appStatusMessage.classList.add('fade-out');
//             appStatusMessage.addEventListener('transitionend', function handler() {
//                 appStatusMessage.classList.add('hidden');
//                 appStatusMessage.removeEventListener('transitionend', handler);
//             }, { once: true });
//         }, duration);
//     }
//     console.log(`showAppStatusMessage: Message displayed - ${message} (Type: ${type})`);
// }

// function updateAddCardButtonState() {
//     console.log('updateAddCardButtonState: Updating add card button state.');
//     if (categories.length === 0) {
//         addCardBtn.disabled = true;
//         addCardBtn.classList.add('opacity-50', 'cursor-not-allowed');
//         addCardBtn.style.backgroundImage = 'none';
//         addCardBtn.style.backgroundColor = 'var(--color-dark-border)';
//     } else {
//         addCardBtn.disabled = false;
//         addCardBtn.classList.remove('opacity-50', 'cursor-not-allowed');
//         addCardBtn.style.backgroundImage = '';
//         addCardBtn.style.backgroundColor = '';
//     }
// }


// // --- Category CRUD Operations ---

// async function handleAddCategoryFormSubmit(event) {
//     event.preventDefault();
//     console.log('handleAddCategoryFormSubmit: Adding new category.');
//     showMessage(addCategoryMessage, '', 'hidden', 0);

//     const categoryName = newCategoryNameInput.value.trim();
//     if (!categoryName) {
//         showMessage(addCategoryMessage, 'Category name cannot be empty.', 'error');
//         return;
//     }

//     try {
//         await apiCall('/categories', 'POST', { name: categoryName });
//         showMessage(addCategoryMessage, 'Category added successfully!', 'success');
//         newCategoryNameInput.value = '';
//         hideModal(addCategoryModal);
//         fetchCategoriesAndCards();
//         console.log('handleAddCategoryFormSubmit: Category added successfully.');
//     } catch (error) {
//         console.error('handleAddCategoryFormSubmit: Error adding category:', error);
//         // The error message from the API will be displayed here, e.g., "Category with this name already exists for this user."
//         showMessage(addCategoryMessage, error.message, 'error');
//     }
// }

// async function handleDeleteCategory(categoryId) {
//     console.log('handleDeleteCategory: Deleting category with ID:', categoryId);
//     try {
//         await apiCall(`/categories/${categoryId}`, 'DELETE');
//         showAppStatusMessage('Category and its cards deleted successfully!', 'success');
//         fetchCategoriesAndCards();
//         console.log('handleDeleteCategory: Category deleted successfully.');
//     } catch (error) {
//         console.error('handleAddCategoryFormSubmit: Error adding category:', error);
//         // Displaying error message from backend
//         showAppStatusMessage(`Error deleting category: ${error.message}`, 'error');
//     }
// }

// // --- Card CRUD Operations ---

// let editingCardData = null;

// async function handleCardFormSubmit(event) {
//     event.preventDefault();
//     console.log('handleCardFormSubmit: Submitting card form.');
//     showMessage(cardFormMessage, '', 'hidden', 0);

//     const title = cardTitleInput.value.trim();
//     const description = cardDescriptionInput.value.trim();
//     const category = cardCategorySelect.value;

//     if (!title || !description || !category) {
//         showMessage(cardFormMessage, 'All fields are required.', 'error');
//         return;
//     }

//     const cardData = { title, description, category };

//     try {
//         if (editingCardData) {
//             await apiCall(`/cards/${editingCardData._id}`, 'PUT', cardData);
//             showMessage(cardFormMessage, 'Task updated successfully!', 'success');
//             console.log('handleCardFormSubmit: Card updated successfully.');
//         } else {
//             await apiCall('/cards', 'POST', cardData);
//             showMessage(cardFormMessage, 'Task added successfully!', 'success');
//             console.log('handleCardFormSubmit: Card added successfully.');
//         }
//         cardForm.reset();
//         hideModal(addEditCardModal);
//         fetchCategoriesAndCards();
//     } catch (error) {
//         console.error('handleCardFormSubmit: Error submitting card form:', error);
//         showMessage(cardFormMessage, error.message, 'error');
//     }
// }

// function openAddEditCardModal(cardToEdit = null) {
//     console.log('openAddEditCardModal: Opening card modal. Editing:', !!cardToEdit);
//     editingCardData = cardToEdit;
//     cardForm.reset();

//     if (cardToEdit) {
//         cardModalTitle.textContent = 'Edit Task';
//         cardTitleInput.value = cardToEdit.title;
//         cardDescriptionInput.value = cardToEdit.description;
//         cardCategorySelect.value = cardToEdit.category;
//         cardSubmitBtn.textContent = 'Save Changes';
//     } else {
//         cardModalTitle.textContent = 'Add New Task';
//         cardSubmitBtn.textContent = 'Add Task';
//     }

//     cardCategorySelect.innerHTML = '';
//     if (categories.length === 0) {
//         const option = document.createElement('option');
//         option.value = '';
//         option.textContent = 'No categories available';
//         option.disabled = true;
//         option.selected = true;
//         cardCategorySelect.appendChild(option);
//         console.warn('openAddEditCardModal: No categories available to populate dropdown.');
//     } else {
//         categories.forEach(cat => {
//             const option = document.createElement('option');
//             option.value = cat.name;
//             option.textContent = cat.name;
//             cardCategorySelect.appendChild(option);
//         });
//         if (cardToEdit && categories.some(cat => cat.name === cardToEdit.category)) {
//             cardCategorySelect.value = cardToEdit.category;
//         } else if (categories.length > 0) {
//             cardCategorySelect.value = categories[0].name;
//         }
//     }
//     showMessage(cardFormMessage, '', 'hidden', 0);
//     showModal(addEditCardModal);
// }

// async function handleDeleteCard(cardId) {
//     console.log('handleDeleteCard: Deleting card with ID:', cardId);
//     try {
//         await apiCall(`/cards/${cardId}`, 'DELETE');
//         showAppStatusMessage('Card deleted successfully!', 'success');
//         fetchCategoriesAndCards();
//         console.log('handleDeleteCard: Card deleted successfully.');
//     } catch (error) {
//         console.error('handleDeleteCard: Error deleting card:', error);
//         showAppStatusMessage(`Error deleting card: ${error.message}`, 'error');
//     }
// }

// // --- Card Options Menu Logic ---
// let activeCardOptionsMenuButton = null;

// function showCardOptionsMenu(cardData, buttonElement) {
//     console.log('showCardOptionsMenu: Showing options for card:', cardData._id);
//     hideCardOptionsMenu();

//     activeCardOptionsMenuButton = buttonElement;
//     currentEditingCardId = cardData._id;

//     const rect = buttonElement.getBoundingClientRect();
//     cardOptionsMenu.style.top = `${rect.bottom + 5}px`;
//     cardOptionsMenu.style.left = `${rect.left}px`;
//     cardOptionsMenu.classList.add('show');

//     editCardMenuItem.onclick = () => {
//         openAddEditCardModal(cardData);
//         hideCardOptionsMenu();
//     };
//     deleteCardMenuItem.onclick = () => {
//         showConfirmation('Are you sure you want to delete this card?', () => handleDeleteCard(cardData._id));
//         hideCardOptionsMenu();
//     };

//     setTimeout(() => {
//         document.addEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
//     }, 0);
// }

// function hideCardOptionsMenu() {
//     console.log('hideCardOptionsMenu: Hiding card options menu.');
//     cardOptionsMenu.classList.remove('show');
//     document.removeEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
//     activeCardOptionsMenuButton = null;
//     currentEditingCardId = null;
// }

// function handleClickOutsideCardOptionsMenu(event) {
//     if (
//         !cardOptionsMenu.contains(event.target) &&
//         activeCardOptionsMenuButton && activeCardOptionsMenuButton.contains(event.target)
//     ) {
//         hideCardOptionsMenu();
//     }
// }


// // --- Drag and Drop Logic ---

// let draggedCardElement = null;

// function handleDragStart(event) {
//     if (event.target.closest('.options-btn')) {
//         event.preventDefault();
//         return;
//     }
//     draggedCardElement = event.currentTarget;
//     draggedCardElement.classList.add('dragging');
//     event.dataTransfer.setData('text/plain', draggedCardElement.dataset.id);
//     event.dataTransfer.effectAllowed = 'move';
//     console.log('handleDragStart: Card drag started for ID:', draggedCardElement.dataset.id);
// }

// function handleDragEnd(event) {
//     if (draggedCardElement) {
//         draggedCardElement.classList.remove('dragging');
//         draggedCardElement = null;
//     }
//     document.querySelectorAll('.kanban-column').forEach(col => {
//         col.classList.remove('drag-over');
//     });
//     console.log('handleDragEnd: Card drag ended.');
// }

// function handleDragOver(event) {
//     event.preventDefault();
//     event.currentTarget.classList.add('drag-over');
// }

// function handleDragLeave(event) {
//     event.currentTarget.classList.remove('drag-over');
// }

// async function handleDrop(event) {
//     event.preventDefault();
//     const droppedOnColumn = event.currentTarget;
//     droppedOnColumn.classList.remove('drag-over');
//     console.log('handleDrop: Card dropped on column:', droppedOnColumn.dataset.category);

//     if (draggedCardElement) {
//         const cardId = event.dataTransfer.getData('text/plain');
//         const oldCategory = draggedCardElement.dataset.category;
//         const newCategory = droppedOnColumn.dataset.category;

//         if (oldCategory !== newCategory) {
//             console.log(`handleDrop: Moving card ${cardId} from ${oldCategory} to ${newCategory}`);
//             try {
//                 await apiCall(`/cards/${cardId}`, 'PUT', { category: newCategory });
//                 showAppStatusMessage(`Card moved to ${newCategory}!`, 'success');
//                 fetchCategoriesAndCards();
//                 console.log('handleDrop: Card move successful.');
//             } catch (error) {
//                 console.error('handleDrop: Error moving card:', error);
//                 showAppStatusMessage(`Error moving card: ${error.message}`, 'error');
//             }
//         } else {
//             console.log('handleDrop: Card dropped in same category, no action needed.');
//         }
//     }
// }

// // --- Confirmation Modal Logic ---
// function showConfirmation(message, onConfirmCallback) {
//     console.log('showConfirmation: Displaying confirmation modal.');
//     confirmationMessage.textContent = message;
//     showModal(confirmationModal);
//     currentConfirmationAction = onConfirmCallback;
// }

// function hideConfirmation() {
//     console.log('hideConfirmation: Hiding confirmation modal.');
//     hideModal(confirmationModal);
//     currentConfirmationAction = null;
// }

// // --- Event Listeners (Initialized on DOMContentLoaded) ---
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOMContentLoaded: Initializing event listeners.');
//     // Auth View Listeners
//     authForm.addEventListener('submit', handleAuthSubmit);
//     authToggleLink.addEventListener('click', () => {
//         setAppView(currentAuthViewType === 'login' ? 'register' : 'login');
//     });

//     // Board View Listeners
//     logoutBtn.addEventListener('click', logoutUser);
//     settingsLogoutBtn.addEventListener('click', logoutUser);
//     settingsBtn.addEventListener('click', renderSettingsModal);
//     addCategoryBtn.addEventListener('click', () => {
//         showModal(addCategoryModal);
//         showMessage(addCategoryMessage, '', 'hidden', 0);
//         newCategoryNameInput.value = '';
//     });
//     addCardBtn.addEventListener('click', () => openAddEditCardModal());

//     // Modals Close Buttons (unified handler)
//     document.querySelectorAll('.close-button').forEach(button => {
//         button.addEventListener('click', (event) => {
//             const modalId = event.target.dataset.modal;
//             const modalElement = document.getElementById(modalId);
//             if (modalElement) {
//                 hideModal(modalElement);
//                 console.log('Modal closed by close button:', modalId);
//             }
//         });
//     });

//     // Modals Click Outside (unified handler for main modals)
//     document.querySelectorAll('.modal').forEach(modal => {
//         modal.addEventListener('click', (event) => {
//             if (event.target === modal) {
//                 hideModal(modal);
//                 console.log('Modal closed by clicking outside:', modal.id);
//             }
//         });
//     });

//     // Add Category Modal Listeners
//     addCategoryForm.addEventListener('submit', handleAddCategoryFormSubmit);

//     // Add/Edit Card Modal Listeners
//     cardForm.addEventListener('submit', handleCardFormSubmit);

//     // Settings Modal Listeners
//     updateUsernameForm.addEventListener('submit', handleUpdateUsername);
//     updatePasswordForm.addEventListener('submit', handleUpdatePassword);
//     connectDiscordBtn.addEventListener('click', handleConnectDiscord);

//     // NEW: Settings Tab Button Listeners
//     tabButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const tabId = button.dataset.tabId;
//             switchSettingsTab(tabId);
//         });
//     });

//     // Confirmation Modal Listeners
//     confirmActionBtn.addEventListener('click', () => {
//         if (currentConfirmationAction) {
//             currentConfirmationAction();
//             console.log('Confirmation action executed.');
//         }
//         hideConfirmation();
//     });
//     cancelActionBtn.addEventListener('click', hideConfirmation);

//     // Initial check on load to determine which view to show
//     checkAuthAndRender();

//     // Listener for clicks anywhere on the document to hide the options menu
//     document.addEventListener('click', (event) => {
//         const target = event.target;
//         const isClickInsideMenu = cardOptionsMenu.contains(target);
//         const isClickOnToggleButton = activeCardOptionsMenuButton && activeCardOptionsMenuButton.contains(target);

//         if (cardOptionsMenu.classList.contains('show') && !isClickInsideMenu && !isClickOnToggleButton) {
//             hideCardOptionsMenu();
//         }
//     });
//     console.log('DOMContentLoaded: Initialization complete.');
// });


// // --- Global DOM Element References (cached for performance) ---
// const API_BASE_URL = 'https://taskfllow.onrender.com/api'; // Your deployed Render backend API URL

// const authView = document.getElementById('auth-view');
// const boardView = document.getElementById('board-view');

// const authForm = document.getElementById('auth-form');
// const authTitle = document.getElementById('auth-title');
// const authUsernameInput = document.getElementById('auth-username');
// const authPasswordInput = document.getElementById('auth-password');
// const authSubmitBtn = document.getElementById('auth-submit-btn');
// const authToggleLink = document.getElementById('auth-toggle-link');
// const authMessage = document.getElementById('auth-message');

// const welcomeUsernameSpan = document.getElementById('welcome-username');
// const logoutBtn = document.getElementById('logout-btn');
// const settingsBtn = document.getElementById('settings-btn');
// const appStatusMessage = document.getElementById('app-status-message');

// const kanbanBoardContainer = document.getElementById('kanban-board-container');
// const addCardBtn = document.getElementById('add-card-btn');
// const addCategoryBtn = document.getElementById('add-category-btn');

// // Modals
// const addCategoryModal = document.getElementById('add-category-modal');
// const addCategoryForm = document.getElementById('add-category-form');
// const newCategoryNameInput = document.getElementById('new-category-name');
// const addCategoryMessage = document.getElementById('add-category-message');

// const addEditCardModal = document.getElementById('add-edit-card-modal');
// const cardModalTitle = document.getElementById('card-modal-title');
// const cardForm = document.getElementById('card-form');
// const cardTitleInput = document.getElementById('card-title-input');
// const cardDescriptionInput = document.getElementById('card-description-input');
// const cardCategorySelect = document.getElementById('card-category-select');
// const cardSubmitBtn = document.getElementById('card-submit-btn');
// const cardFormMessage = document.getElementById('card-form-message');

// const settingsModal = document.getElementById('settings-modal');
// const settingsUsernameDisplay = document.getElementById('settings-username-display');
// const settingsUserIdDisplay = document.getElementById('settings-user-id-display');
// const settingsDiscordStatus = document.getElementById('settings-discord-status');
// const updateUsernameForm = document.getElementById('update-username-form');
// const settingsNewUsernameInput = document.getElementById('settings-new-username');
// const usernameUpdateMessage = document.getElementById('username-update-message');
// const updatePasswordForm = document.getElementById('update-password-form');
// const settingsOldPasswordInput = document.getElementById('settings-old-password');
// const settingsNewPasswordInput = document.getElementById('settings-new-password');
// const passwordUpdateMessage = document.getElementById('password-update-message');
// const connectDiscordBtn = document.getElementById('connect-discord-btn');
// const discordConnectMessage = document.getElementById('discord-connect-message');
// const settingsLogoutBtn = document.getElementById('settings-logout-btn');

// // Settings Tabs Elements
// const tabButtons = document.querySelectorAll('.tab-button');
// const tabContents = document.querySelectorAll('.tab-content');

// const confirmationModal = document.getElementById('confirmation-modal');
// const confirmationMessage = document.getElementById('confirmation-message');
// const confirmActionBtn = document.getElementById('confirm-action-btn');
// const cancelActionBtn = document.getElementById('cancel-action-btn');

// const cardOptionsMenu = document.getElementById('card-options-menu');
// const editCardMenuItem = document.getElementById('edit-card-menu-item');
// const deleteCardMenuItem = document.getElementById('delete-card-menu-item');

// // *** NEW ADMIN PANEL DOM ELEMENTS ***
// const adminPanelBtn = document.getElementById('admin-panel-btn'); // Button in settings modal
// const adminPanelModal = document.getElementById('admin-panel-modal'); // The admin panel modal itself
// const adminStep1 = document.getElementById('admin-step-1'); // User ID input step
// const adminUserIdInput = document.getElementById('admin-user-id-input');
// const adminStep1Message = document.getElementById('admin-step-1-message');
// const adminNextBtn = document.getElementById('admin-next-btn');

// const adminStep2 = document.getElementById('admin-step-2'); // User management step
// const adminManagedUsername = document.getElementById('admin-managed-username');
// const adminManagedUserId = document.getElementById('admin-managed-user-id');
// const adminManagedDiscordId = document.getElementById('admin-managed-discord-id');
// const adminManagedDiscordUsername = document.getElementById('admin-managed-discord-username');
// const adminStep2Message = document.getElementById('admin-step-2-message');

// const adminUpdateUsernameForm = document.getElementById('admin-update-username-form');
// const adminNewUsernameInput = document.getElementById('admin-new-username-input');
// const adminUsernameUpdateMessage = document.getElementById('admin-username-update-message');

// const adminResetPasswordForm = document.getElementById('admin-reset-password-form');
// const adminNewPasswordInput = document.getElementById('admin-new-password-input');
// const adminPasswordResetMessage = document.getElementById('admin-password-reset-message');

// const adminCategoriesMessage = document.getElementById('admin-categories-message');
// const adminCategoriesList = document.getElementById('admin-categories-list');
// const adminAddCategoryForm = document.getElementById('admin-add-category-form');
// const adminAddCategoryInput = document.getElementById('admin-add-category-input');

// const adminTasksMessage = document.getElementById('admin-tasks-message');
// const adminTasksList = document.getElementById('admin-tasks-list');
// const adminAddTaskForm = document.getElementById('admin-add-task-form');
// const adminAddTaskTitleInput = document.getElementById('admin-add-task-title-input');
// const adminAddTaskDescInput = document.getElementById('admin-add-task-desc-input');
// const adminAddTaskCategorySelect = document.getElementById('admin-add-task-category-select');

// const adminDeleteUserBtn = document.getElementById('admin-delete-user-btn');
// const adminBackToIdInputBtn = document.getElementById('admin-back-to-id-input-btn');


// // --- Global State Variables ---
// let currentAuthViewType = 'login'; // 'login' or 'register'
// let currentUser = null; // Stores { userId, username, discordId, discordUsername, discordDiscriminator, isAdmin }
// let categories = []; // Cache for current categories for the logged-in user
// let cards = []; // Cache for current cards for the logged-in user
// let currentEditingCardId = null; // ID of card being edited
// let currentConfirmationAction = null; // Stores the function to call on confirmation

// // *** NEW ADMIN STATE ***
// // Your Discord User ID that is allowed to access the admin panel
// // This is hardcoded on the frontend for UI visibility, actual security is on the backend.
// const ADMIN_DISCORD_ID_FRONTEND = '1270842894466547825'; // REPLACE WITH YOUR ACTUAL DISCORD USER ID
// let adminManagedUser = null; // Stores the user object currently being managed by the admin


// // --- Utility Functions ---

// /**
//  * Sets the authentication token in localStorage.
//  * @param {string} token - The JWT token.
//  */
// function setAuthToken(token) {
//     try {
//         localStorage.setItem('authToken', token);
//         console.log('setAuthToken: Token successfully saved to localStorage. Length:', token ? token.length : 0);
//     } catch (e) {
//         console.error('setAuthToken: Failed to save token to localStorage:', e);
//         showAppStatusMessage('Error: Could not save session. Please check browser settings (e.g., private mode, storage limits).', 'error', 0);
//     }
// }

// /**
//  * Gets the authentication token from localStorage.
//  * @returns {string|null} The JWT token or null if not found.
//  */
// function getAuthToken() {
//     try {
//         const token = localStorage.getItem('authToken');
//         console.log('getAuthToken: Retrieved token from localStorage. Is token present?', !!token, 'Length:', token ? token.length : 0);
//         return token;
//     } catch (e) {
//         console.error('getAuthToken: Failed to retrieve token from localStorage:', e);
//         return null;
//     }
// }

// /**
//  * Removes the authentication token from localStorage.
//  */
// function removeAuthToken() {
//     try {
//         localStorage.removeItem('authToken');
//         currentUser = null; // Clear current user data
//         console.log('removeAuthToken: Token successfully removed from localStorage.');
//     } catch (e) {
//         console.error('removeAuthToken: Failed to remove token from localStorage:', e);
//     }
// }

// /**
//  * Displays a status/error message in the designated area.
//  * @param {HTMLElement} element - The DOM element to display the message in.
//  * @param {string} message - The message text.
//  * @param {string} type - 'success', 'error', 'info'.
//  * @param {number} duration - How long the message should display in ms (0 for persistent).
//  */
// function showMessage(element, message, type = 'error', duration = 3000) {
//     element.textContent = message;
//     element.classList.remove('hidden', 'error-message', 'success-message', 'info-message'); // Clear previous types
//     if (type === 'error') {
//         element.classList.add('error-message');
//     } else if (type === 'success') {
//         element.classList.add('success-message');
//     } else {
//         element.classList.add('info-message');
//     }
//     element.classList.remove('hidden');

//     if (duration > 0) {
//         setTimeout(() => {
//             element.classList.add('hidden');
//             element.textContent = '';
//         }, duration);
//     }
// }

// /**
//  * Displays a modal with a fade-in animation.
//  * @param {HTMLElement} modalElement - The modal DOM element.
//  */
// function showModal(modalElement) {
//     modalElement.style.display = 'flex'; // Ensure display is not 'none' for animation to work
//     modalElement.classList.remove('hidden-fade'); // Remove fade-out class if present
//     modalElement.classList.add('visible'); // Trigger fade-in animation
// }

// /**
//  * Hides a modal with a fade-out animation.
//  * @param {HTMLElement} modalElement - The modal DOM element.
//  */
// function hideModal(modalElement) {
//     modalElement.classList.remove('visible');
//     modalElement.classList.add('hidden-fade'); // Trigger fade-out animation
//     // After animation, set display to none to remove from layout and improve accessibility
//     modalElement.addEventListener('animationend', function handler() {
//         modalElement.classList.remove('hidden-fade'); // Clean up animation class
//         modalElement.style.display = 'none'; // Fully hide the modal
//         modalElement.removeEventListener('animationend', handler); // Remove listener
//     }, { once: true }); // Ensure listener runs only once
// }


// // --- API Call Wrapper (Enhanced Error Handling and Logging) ---
// async function apiCall(endpoint, method = 'GET', data = null) {
//     console.log(`\napiCall: Initiating ${method} request to ${endpoint}`);
//     const token = getAuthToken(); // Always get the latest token right before the call

//     const headers = {
//         'Content-Type': 'application/json',
//     };
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//         console.log('apiCall: Authorization header being sent: Bearer (token present)');
//     } else {
//         console.warn('apiCall: No token found for this request. Authorization header will NOT be sent.');
//     }

//     const config = {
//         method,
//         headers,
//     };
//     if (data) {
//         config.body = JSON.stringify(data);
//     }
//     console.log('apiCall: Fetch config:', config);

//     try {
//         const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
//         const responseData = await response.json();
//         console.log(`apiCall: Response status for ${endpoint}: ${response.status}`);
//         console.log('apiCall: Response Data:', responseData);

//         if (!response.ok) {
//             if (response.status === 401 || response.status === 403) {
//                 console.warn(`apiCall: Received ${response.status}. Session invalid/expired. Forcing logout.`);
//                 removeAuthToken();
//                 setAppView('login');
//                 showAppStatusMessage('Your session has expired or is invalid. Please log in or register again.', 'error', 0);
//             }
//             throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
//         }
//         return responseData;
//     } catch (error) {
//         console.error(`API Call Error (${method} ${endpoint}):`, error);
//         throw error;
//     }
// }


// // --- View Management ---

// /**
//  * Switches the active view of the application.
//  * @param {string} viewName - 'login', 'register', or 'board'.
//  */
// function setAppView(viewName) {
//     console.log('setAppView: Switching to view:', viewName);
//     authView.classList.add('hidden');
//     boardView.classList.add('hidden');

//     if (viewName === 'board') {
//         boardView.classList.remove('hidden');
//     } else {
//         authView.classList.remove('hidden');
//         if (viewName === 'login') {
//             currentAuthViewType = 'login';
//             authTitle.textContent = 'Login';
//             authSubmitBtn.textContent = 'Login';
//             authToggleLink.textContent = 'Register here.';
//         } else { // register
//             currentAuthViewType = 'register';
//             authTitle.textContent = 'Create Account';
//             authSubmitBtn.textContent = 'Register';
//             authToggleLink.textContent = 'Login here.';
//         }
//         authForm.reset();
//         authMessage.classList.add('hidden');
//     }
// }

// /**
//  * Loads board data and handles Discord callback parameters.
//  * Called specifically after successful login/registration or on initial page load if authenticated.
//  */
// async function loadBoardDataAndRender() {
//     console.log('--- ENTERING loadBoardDataAndRender --- Starting board data load and Discord param check.');
//     const urlParams = new URLSearchParams(window.location.search);
//     const discordStatus = urlParams.get('discord_connect_status');
//     const discordMessage = urlParams.get('message');
//     const discordToken = urlParams.get('token');
//     const discordUsername = urlParams.get('discord_username');
//     const discordDiscriminator = urlParams.get('discord_discriminator');

//     if (discordStatus) {
//         console.log('loadBoardDataAndRender: Discord callback parameters detected.');
//         const statusType = discordStatus === 'success' ? 'success' : (discordStatus === 'info' ? 'info' : 'error');
//         let displayMessage = decodeURIComponent(discordMessage || 'Unknown status.');

//         if (discordToken) {
//             console.log('loadBoardDataAndRender: Received new token from Discord callback. Logging in with it.');
//             setAuthToken(discordToken);
//             // After setting token, re-check auth to update currentUser and fetch board
//             await checkAuthAndRender(); // This will re-trigger the board load
//         }

//         if (discordStatus === 'success' && discordUsername && discordDiscriminator) {
//             displayMessage = `Successfully connected Discord: ${decodeURIComponent(discordUsername)}#${decodeURIComponent(discordDiscriminator)}. (You can manage this in settings).`;
//         } else if (discordMessage) {
//             displayMessage = decodeURIComponent(discordMessage);
//         }

//         showAppStatusMessage(`Discord Connection: ${displayMessage}`, statusType);
//         window.history.replaceState({}, document.title, window.location.pathname);
//         return;
//     }

//     await fetchCategoriesAndCards();
//     console.log('loadBoardDataAndRender: Board data loaded and rendered.');
// }


// // --- Authentication Logic ---

// async function handleAuthSubmit(event) {
//     event.preventDefault();
//     console.log('--- ENTERING handleAuthSubmit --- Form submission for', currentAuthViewType);
//     showMessage(authMessage, '', 'hidden', 0);

//     const username = authUsernameInput.value.trim();
//     const password = authPasswordInput.value.trim();

//     if (!username || !password) {
//         showMessage(authMessage, 'Please enter both username and password.', 'error');
//         return;
//     }

//     let endpoint = currentAuthViewType === 'register' ? '/register' : '/login';

//     try {
//         const data = await apiCall(endpoint, 'POST', { username, password });
//         console.log('handleAuthSubmit: API call successful, received data:', data);
//         setAuthToken(data.token);
//         // Populate currentUser including the isAdmin flag based on Discord ID
//         currentUser = {
//             userId: data.userId,
//             username: data.username,
//             discordId: data.discordId,
//             discordUsername: data.discordUsername,
//             discordDiscriminator: data.discordDiscriminator,
//             isAdmin: data.discordId === ADMIN_DISCORD_ID_FRONTEND // Set admin flag here
//         };
//         welcomeUsernameSpan.textContent = data.username;

//         setAppView('board');
//         setTimeout(loadBoardDataAndRender, 100);
//     } catch (error) {
//         showMessage(authMessage, error.message, 'error');
//     }
// }

// async function checkAuthAndRender() {
//     console.log('--- ENTERING checkAuthAndRender --- Starting authentication check on page load.');
//     const token = getAuthToken();

//     if (token) {
//         console.log('checkAuthAndRender: Token found, attempting to fetch user profile.');
//         try {
//             const userProfile = await apiCall('/profile');
//             // Ensure currentUser is fully populated, including Discord details and isAdmin flag
//             currentUser = {
//                 userId: userProfile._id,
//                 username: userProfile.username,
//                 discordId: userProfile.discordId,
//                 discordUsername: userProfile.discordUsername,
//                 discordDiscriminator: userProfile.discordDiscriminator,
//                 isAdmin: userProfile.discordId === ADMIN_DISCORD_ID_FRONTEND // Set admin flag here
//             };
//             welcomeUsernameSpan.textContent = userProfile.username;
//             console.log('checkAuthAndRender: User profile fetched successfully:', userProfile);

//             setAppView('board');
//             setTimeout(loadBoardDataAndRender, 100);
//         } catch (error) {
//             console.error("checkAuthAndRender: Initial profile fetch failed, app should be redirecting to login:", error);
//         }
//     } else {
//         console.log('checkAuthAndRender: No token found on startup. Ensuring clean state and setting app view to login.');
//         removeAuthToken();
//         setAppView('login');
//         showAppStatusMessage('No active session found. Please log in or register.', 'info', 0);
//     }
// }

// function logoutUser() {
//     console.log('logoutUser: Initiating logout process.');
//     removeAuthToken();
//     setAppView('login');
//     showAppStatusMessage('Logged out successfully.', 'success');
// }

// // --- User Profile/Settings Logic ---

// // Function to handle tab switching in settings modal
// function switchSettingsTab(tabId) {
//     console.log('switchSettingsTab: Activating tab:', tabId);
//     tabButtons.forEach(button => button.classList.remove('active'));
//     tabContents.forEach(content => {
//         content.classList.remove('active-tab-content');
//         content.classList.add('hidden');
//     });

//     const targetButton = document.querySelector(`.tab-button[data-tab-id="${tabId}"]`);
//     if (targetButton) {
//         targetButton.classList.add('active');
//     }

//     const targetContent = document.getElementById(tabId);
//     if (targetContent) {
//         targetContent.classList.remove('hidden');
//         void targetContent.offsetWidth; // Trigger reflow
//         targetContent.classList.add('active-tab-content');
//     }
// }


// async function renderSettingsModal() {
//     console.log('renderSettingsModal: Opening settings modal.');
//     if (!currentUser) {
//         console.error('renderSettingsModal: No current user data, cannot render settings.');
//         showAppStatusMessage('Error: User data not loaded. Please log in.', 'error');
//         return;
//     }

//     try {
//         const updatedUser = await apiCall('/profile');
//         currentUser = {
//             userId: updatedUser._id,
//             username: updatedUser.username,
//             discordId: updatedUser.discordId,
//             discordDiscriminator: updatedUser.discriminator, // Make sure discriminator is retrieved
//             discordUsername: updatedUser.discordUsername,
//             isAdmin: updatedUser.discordId === ADMIN_DISCORD_ID_FRONTEND // Re-evaluate admin status
//         };
//         console.log('renderSettingsModal: User profile refreshed successfully:', currentUser);
//     } catch (error) {
//         console.error('renderSettingsModal: Error refreshing profile data:', error);
//         showAppStatusMessage(`Error refreshing profile data: ${error.message}`, 'error');
//         return;
//     }

//     settingsUsernameDisplay.textContent = currentUser.username;
//     settingsUserIdDisplay.textContent = currentUser.userId || 'N/A';

//     if (currentUser.discordId) {
//         let discordDisplayName = '';
//         if (currentUser.discordUsername && currentUser.discordDiscriminator) {
//             discordDisplayName = `${currentUser.discordUsername}#${currentUser.discordDiscriminator}`;
//         } else {
//             discordDisplayName = currentUser.discordId;
//         }
//         settingsDiscordStatus.textContent = `Discord Connected: ${discordDisplayName}`;
//         settingsDiscordStatus.classList.remove('text-red-400');
//         settingsDiscordStatus.classList.add('text-green-400', 'settings-discord-status');
//         connectDiscordBtn.textContent = 'Discord Connected';
//         connectDiscordBtn.disabled = true;
//     } else {
//         settingsDiscordStatus.textContent = 'Discord Not Connected';
//         settingsDiscordStatus.classList.remove('text-green-400');
//         settingsDiscordStatus.classList.add('text-red-400', 'settings-discord-status');
//         connectDiscordBtn.textContent = 'Connect Discord';
//         connectDiscordBtn.disabled = false;
//     }

//     // *** NEW: Show/Hide Admin Panel button ***
//     if (currentUser.isAdmin) {
//         adminPanelBtn.classList.remove('hidden');
//     } else {
//         adminPanelBtn.classList.add('hidden');
//     }

//     showMessage(usernameUpdateMessage, '', 'hidden', 0);
//     showMessage(passwordUpdateMessage, '', 'hidden', 0);
//     showMessage(discordConnectMessage, '', 'hidden', 0);

//     settingsNewUsernameInput.value = currentUser.username;
//     settingsOldPasswordInput.value = '';
//     settingsNewPasswordInput.value = '';

//     switchSettingsTab('account-info-tab'); // Default to Account Info tab

//     showModal(settingsModal);
// }

// async function handleUpdateUsername(event) {
//     event.preventDefault();
//     console.log('handleUpdateUsername: Updating username.');
//     showMessage(usernameUpdateMessage, '', 'hidden', 0);

//     const newUsername = settingsNewUsernameInput.value.trim();
//     if (!newUsername) {
//         showMessage(usernameUpdateMessage, 'New username cannot be empty.', 'error');
//         return;
//     }
//     if (newUsername === currentUser.username) {
//         showMessage(usernameUpdateMessage, 'Username is already up to date.', 'success');
//         return;
//     }

//     try {
//         const data = await apiCall('/profile/username', 'PUT', { username: newUsername });
//         setAuthToken(data.token);
//         currentUser.username = data.username;
//         welcomeUsernameSpan.textContent = data.username;
//         settingsUsernameDisplay.textContent = data.username;
//         showMessage(usernameUpdateMessage, 'Username updated successfully!', 'success');
//         console.log('handleUpdateUsername: Username updated successfully.');
//     } catch (error) {
//         console.error('handleUpdateUsername: Error updating username:', error);
//         showMessage(usernameUpdateMessage, error.message, 'error');
//     }
// }

// async function handleUpdatePassword(event) {
//     event.preventDefault();
//     console.log('handleUpdatePassword: Updating password.');
//     showMessage(passwordUpdateMessage, '', 'hidden', 0);

//     const oldPassword = settingsOldPasswordInput.value.trim();
//     const newPassword = settingsNewPasswordInput.value.trim();

//     if (!oldPassword || !newPassword) {
//         showMessage(passwordUpdateMessage, 'Both old and new passwords are required.', 'error');
//         return;
//     }
//     if (oldPassword === newPassword) {
//         showMessage(passwordUpdateMessage, 'New password cannot be the same as old password.', 'error');
//         return;
//     }

//     try {
//         await apiCall('/profile/password', 'PUT', { oldPassword, newPassword });
//         showMessage(passwordUpdateMessage, 'Password updated successfully!', 'success');
//         settingsOldPasswordInput.value = '';
//         settingsNewPasswordInput.value = '';
//         console.log('handleUpdatePassword: Password updated successfully.');
//     } catch (error) {
//         console.error('handleUpdatePassword: Error updating password:', error);
//         showMessage(passwordUpdateMessage, error.message, 'error');
//     }
// }

// async function handleConnectDiscord() {
//     console.log('handleConnectDiscord: Initiating Discord connection.');
//     showMessage(discordConnectMessage, '', 'hidden', 0);
//     try {
//         const data = await apiCall('/discord/login', 'GET');
//         console.log('handleConnectDiscord: Redirecting to Discord URL:', data.redirectUrl);
//         window.location.href = data.redirectUrl;
//     } catch (error) {
//         console.error('handleConnectDiscord: Error connecting Discord:', error);
//         showMessage(discordConnectMessage, error.message, 'error');
//     }
// }


// // --- Kanban Board Rendering ---

// async function fetchCategoriesAndCards() {
//     console.log('--- ENTERING fetchCategoriesAndCards --- Fetching categories and cards.');
//     showAppStatusMessage('Loading categories and cards...', 'info', 0);
//     try {
//         const fetchedCategories = await apiCall('/categories');
//         categories = fetchedCategories;
//         console.log('fetchCategoriesAndCards: Categories fetched:', categories);

//         const fetchedCards = await apiCall('/cards');
//         cards = fetchedCards;
//         console.log('fetchCategoriesAndCards: Cards fetched:', cards);

//         renderKanbanBoard();
//         updateAddCardButtonState();
//         showAppStatusMessage('Board loaded successfully.', 'success');
//     } catch (error) {
//         console.error('fetchCategoriesAndCards: Error loading board data:', error);
//         showAppStatusMessage(`Error loading board: ${error.message}. You might need to log in again.`, 'error', 0);
//     }
// }

// function renderKanbanBoard() {
//     console.log('renderKanbanBoard: Rendering Kanban board.');
//     kanbanBoardContainer.innerHTML = '';

//     if (categories.length === 0) {
//         console.log('renderKanbanBoard: No categories found, displaying message.');
//         const noCategoriesMessage = document.createElement('div');
//         noCategoriesMessage.className = 'text-center text-gray-500 text-lg w-full mt-10';
//         noCategoriesMessage.textContent = 'No categories yet! Click "Add Category" to get started.';
//         kanbanBoardContainer.appendChild(noCategoriesMessage);
//         return;
//     }

//     categories.forEach(category => {
//         const column = document.createElement('div');
//         column.classList.add('kanban-column');
//         column.dataset.category = category.name;
//         column.dataset.categoryId = category._id;

//         column.addEventListener('dragover', handleDragOver);
//         column.addEventListener('dragleave', handleDragLeave);
//         column.addEventListener('drop', handleDrop);

//         column.innerHTML = `
//             <div class="flex justify-between items-center mb-2">
//                 <h2>${category.name}</h2>
//                 <button class="text-red-400 hover:text-red-600 transition-colors delete-category-btn" data-category-id="${category._id}">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
//                 </button>
//             </div>
//             <div class="kanban-column-content">
//                 <!-- Cards will be injected here -->
//             </div>
//         `;
//         kanbanBoardContainer.appendChild(column);

//         const columnContent = column.querySelector('.kanban-column-content');
//         cards.filter(card => card.category === category.name).forEach(cardData => {
//             columnContent.appendChild(createCardElement(cardData));
//         });
//     });

//     document.querySelectorAll('.delete-category-btn').forEach(button => {
//         button.onclick = () => {
//             const categoryId = button.dataset.categoryId;
//             showConfirmation('Are you sure you want to delete this category? All cards in it will also be deleted.', () => handleDeleteCategory(categoryId));
//         };
//     });
//     console.log('renderKanbanBoard: Board rendering complete.');
// }

// /**
//  * Creates and returns a DOM element for a Kanban card.
//  * @param {Object} cardData - Object containing _id, title, description, category.
//  * @returns {HTMLElement} The created card div element.
//  */
// function createCardElement(cardData) {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     card.setAttribute('draggable', 'true');
//     card.dataset.id = cardData._id;
//     card.dataset.category = cardData.category;

//     card.innerHTML = `
//         <div class="card-header">
//             <h3>${cardData.title}</h3>
//             <button class="options-btn" data-id="${cardData._id}">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
//             </button>
//         </div>
//         <p>${cardData.description}</p>
//     `;

//     card.addEventListener('dragstart', handleDragStart);
//     card.addEventListener('dragend', handleDragEnd);

//     const optionsButton = card.querySelector('.options-btn');
//     optionsButton.addEventListener('click', (e) => {
//         e.stopPropagation();
//         showCardOptionsMenu(cardData, optionsButton);
//     });

//     return card;
// }

// /**
//  * Shows the main app status message at the top of the board.
//  * @param {string} message
//  * @param {string} type - 'success', 'error', 'info'
//  * @param {number} [duration=3000] - Duration in ms, 0 for permanent
//  */
// function showAppStatusMessage(message, type = 'info', duration = 3000) {
//     appStatusMessage.textContent = message;
//     appStatusMessage.className = `text-center p-3 rounded-lg mb-4`;
//     if (type === 'error') {
//         appStatusMessage.classList.add('bg-red-700', 'text-white');
//     } else if (type === 'success') {
//         appStatusMessage.classList.add('bg-green-700', 'text-white');
//     } else {
//         appStatusMessage.classList.add('bg-blue-700', 'text-white');
//     }
//     appStatusMessage.classList.remove('hidden', 'fade-out');
//     appStatusMessage.style.opacity = '1';

//     if (duration > 0) {
//         setTimeout(() => {
//             appStatusMessage.classList.add('fade-out');
//             appStatusMessage.addEventListener('transitionend', function handler() {
//                 appStatusMessage.classList.add('hidden');
//                 appStatusMessage.removeEventListener('transitionend', handler);
//             }, { once: true });
//         }, duration);
//     }
//     console.log(`showAppStatusMessage: Message displayed - ${message} (Type: ${type})`);
// }

// function updateAddCardButtonState() {
//     console.log('updateAddCardButtonState: Updating add card button state.');
//     if (categories.length === 0) {
//         addCardBtn.disabled = true;
//         addCardBtn.classList.add('opacity-50', 'cursor-not-allowed');
//         addCardBtn.style.backgroundImage = 'none';
//         addCardBtn.style.backgroundColor = 'var(--color-dark-border)';
//     } else {
//         addCardBtn.disabled = false;
//         addCardBtn.classList.remove('opacity-50', 'cursor-not-allowed');
//         addCardBtn.style.backgroundImage = '';
//         addCardBtn.style.backgroundColor = '';
//     }
// }


// // --- Category CRUD Operations ---

// async function handleAddCategoryFormSubmit(event) {
//     event.preventDefault();
//     console.log('handleAddCategoryFormSubmit: Adding new category.');
//     showMessage(addCategoryMessage, '', 'hidden', 0);

//     const categoryName = newCategoryNameInput.value.trim();
//     if (!categoryName) {
//         showMessage(addCategoryMessage, 'Category name cannot be empty.', 'error');
//         return;
//     }

//     try {
//         await apiCall('/categories', 'POST', { name: categoryName });
//         showMessage(addCategoryMessage, 'Category added successfully!', 'success');
//         newCategoryNameInput.value = '';
//         hideModal(addCategoryModal);
//         fetchCategoriesAndCards();
//         console.log('handleAddCategoryFormSubmit: Category added successfully.');
//     } catch (error) {
//         console.error('handleAddCategoryFormSubmit: Error adding category:', error);
//         showMessage(addCategoryMessage, error.message, 'error');
//     }
// }

// async function handleDeleteCategory(categoryId) {
//     console.log('handleDeleteCategory: Deleting category with ID:', categoryId);
//     try {
//         await apiCall(`/categories/${categoryId}`, 'DELETE');
//         showAppStatusMessage('Category and its cards deleted successfully!', 'success');
//         fetchCategoriesAndCards();
//         console.log('handleDeleteCategory: Category deleted successfully.');
//     } catch (error) {
//         console.error('handleDeleteCategory: Error deleting category:', error);
//         showAppStatusMessage(`Error deleting category: ${error.message}`, 'error');
//     }
// }

// // --- Card CRUD Operations ---

// let editingCardData = null;

// async function handleCardFormSubmit(event) {
//     event.preventDefault();
//     console.log('handleCardFormSubmit: Submitting card form.');
//     showMessage(cardFormMessage, '', 'hidden', 0);

//     const title = cardTitleInput.value.trim();
//     const description = cardDescriptionInput.value.trim();
//     const category = cardCategorySelect.value;

//     if (!title || !description || !category) {
//         showMessage(cardFormMessage, 'All fields are required.', 'error');
//         return;
//     }

//     const cardData = { title, description, category };

//     try {
//         if (editingCardData) {
//             await apiCall(`/cards/${editingCardData._id}`, 'PUT', cardData);
//             showMessage(cardFormMessage, 'Task updated successfully!', 'success');
//             console.log('handleCardFormSubmit: Card updated successfully.');
//         } else {
//             await apiCall('/cards', 'POST', cardData);
//             showMessage(cardFormMessage, 'Task added successfully!', 'success');
//             console.log('handleCardFormSubmit: Card added successfully.');
//         }
//         cardForm.reset();
//         hideModal(addEditCardModal);
//         fetchCategoriesAndCards();
//     } catch (error) {
//         console.error('handleCardFormSubmit: Error submitting card form:', error);
//         showMessage(cardFormMessage, error.message, 'error');
//     }
// }

// function openAddEditCardModal(cardToEdit = null) {
//     console.log('openAddEditCardModal: Opening card modal. Editing:', !!cardToEdit);
//     editingCardData = cardToEdit;
//     cardForm.reset();

//     if (cardToEdit) {
//         cardModalTitle.textContent = 'Edit Task';
//         cardTitleInput.value = cardToEdit.title;
//         cardDescriptionInput.value = cardToEdit.description;
//         cardCategorySelect.value = cardToEdit.category;
//         cardSubmitBtn.textContent = 'Save Changes';
//     } else {
//         cardModalTitle.textContent = 'Add New Task';
//         cardSubmitBtn.textContent = 'Add Task';
//     }

//     cardCategorySelect.innerHTML = '';
//     if (categories.length === 0) {
//         const option = document.createElement('option');
//         option.value = '';
//         option.textContent = 'No categories available';
//         option.disabled = true;
//         option.selected = true;
//         cardCategorySelect.appendChild(option);
//         console.warn('openAddEditCardModal: No categories available to populate dropdown.');
//     } else {
//         categories.forEach(cat => {
//             const option = document.createElement('option');
//             option.value = cat.name;
//             option.textContent = cat.name;
//             cardCategorySelect.appendChild(option);
//         });
//         if (cardToEdit && categories.some(cat => cat.name === cardToEdit.category)) {
//             cardCategorySelect.value = cardToEdit.category;
//         } else if (categories.length > 0) {
//             cardCategorySelect.value = categories[0].name;
//         }
//     }
//     showMessage(cardFormMessage, '', 'hidden', 0);
//     showModal(addEditCardModal);
// }

// async function handleDeleteCard(cardId) {
//     console.log('handleDeleteCard: Deleting card with ID:', cardId);
//     try {
//         await apiCall(`/cards/${cardId}`, 'DELETE');
//         showAppStatusMessage('Card deleted successfully!', 'success');
//         fetchCategoriesAndCards();
//         console.log('handleDeleteCard: Card deleted successfully.');
//     } catch (error) {
//         console.error('handleDeleteCard: Error deleting card:', error);
//         showAppStatusMessage(`Error deleting card: ${error.message}`, 'error');
//     }
// }

// // --- Card Options Menu Logic ---
// let activeCardOptionsMenuButton = null;

// function showCardOptionsMenu(cardData, buttonElement) {
//     console.log('showCardOptionsMenu: Showing options for card:', cardData._id);
//     hideCardOptionsMenu();

//     activeCardOptionsMenuButton = buttonElement;
//     currentEditingCardId = cardData._id;

//     const rect = buttonElement.getBoundingClientRect();
//     cardOptionsMenu.style.top = `${rect.bottom + 5}px`;
//     cardOptionsMenu.style.left = `${rect.left}px`;
//     cardOptionsMenu.classList.add('show');

//     editCardMenuItem.onclick = () => {
//         openAddEditCardModal(cardData);
//         hideCardOptionsMenu();
//     };
//     deleteCardMenuItem.onclick = () => {
//         showConfirmation('Are you sure you want to delete this card?', () => handleDeleteCard(cardData._id));
//         hideCardOptionsMenu();
//     };

//     setTimeout(() => {
//         document.addEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
//     }, 0);
// }

// function hideCardOptionsMenu() {
//     console.log('hideCardOptionsMenu: Hiding card options menu.');
//     cardOptionsMenu.classList.remove('show');
//     document.removeEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
//     activeCardOptionsMenuButton = null;
//     currentEditingCardId = null;
// }

// function handleClickOutsideCardOptionsMenu(event) {
//     if (
//         !cardOptionsMenu.contains(event.target) &&
//         activeCardOptionsMenuButton && activeCardOptionsMenuButton.contains(event.target)
//     ) {
//         hideCardOptionsMenu();
//     }
// }


// // --- Drag and Drop Logic ---

// let draggedCardElement = null;

// function handleDragStart(event) {
//     if (event.target.closest('.options-btn')) {
//         event.preventDefault();
//         return;
//     }
//     draggedCardElement = event.currentTarget;
//     draggedCardElement.classList.add('dragging');
//     event.dataTransfer.setData('text/plain', draggedCardElement.dataset.id);
//     event.dataTransfer.effectAllowed = 'move';
//     console.log('handleDragStart: Card drag started for ID:', draggedCardElement.dataset.id);
// }

// function handleDragEnd(event) {
//     if (draggedCardElement) {
//         draggedCardElement.classList.remove('dragging');
//         draggedCardElement = null;
//     }
//     document.querySelectorAll('.kanban-column').forEach(col => {
//         col.classList.remove('drag-over');
//     });
//     console.log('handleDragEnd: Card drag ended.');
// }

// function handleDragOver(event) {
//     event.preventDefault();
//     event.currentTarget.classList.add('drag-over');
// }

// function handleDragLeave(event) {
//     event.currentTarget.classList.remove('drag-over');
// }

// async function handleDrop(event) {
//     event.preventDefault();
//     const droppedOnColumn = event.currentTarget;
//     droppedOnColumn.classList.remove('drag-over');
//     console.log('handleDrop: Card dropped on column:', droppedOnColumn.dataset.category);

//     if (draggedCardElement) {
//         const cardId = event.dataTransfer.getData('text/plain');
//         const oldCategory = draggedCardElement.dataset.category;
//         const newCategory = droppedOnColumn.dataset.category;

//         if (oldCategory !== newCategory) {
//             console.log(`handleDrop: Moving card ${cardId} from ${oldCategory} to ${newCategory}`);
//             try {
//                 await apiCall(`/cards/${cardId}`, 'PUT', { category: newCategory });
//                 showAppStatusMessage(`Card moved to ${newCategory}!`, 'success');
//                 fetchCategoriesAndCards();
//                 console.log('handleDrop: Card move successful.');
//             } catch (error) {
//                 console.error('handleDrop: Error moving card:', error);
//                 showAppStatusMessage(`Error moving card: ${error.message}`, 'error');
//             }
//         } else {
//             console.log('handleDrop: Card dropped in same category, no action needed.');
//         }
//     }
// }

// // --- Confirmation Modal Logic ---
// function showConfirmation(message, onConfirmCallback) {
//     console.log('showConfirmation: Displaying confirmation modal.');
//     confirmationMessage.textContent = message;
//     showModal(confirmationModal);
//     currentConfirmationAction = onConfirmCallback;
// }

// function hideConfirmation() {
//     console.log('hideConfirmation: Hiding confirmation modal.');
//     hideModal(confirmationModal);
//     currentConfirmationAction = null;
// }

// // --- NEW ADMIN PANEL LOGIC ---

// function showAdminPanelModal() {
//     console.log('showAdminPanelModal: Opening admin panel modal.');
//     hideModal(settingsModal); // Hide settings modal when opening admin
//     adminUserIdInput.value = ''; // Clear previous input
//     adminManagedUser = null; // Clear managed user state
//     showMessage(adminStep1Message, '', 'hidden', 0); // Clear message
//     switchAdminPanelStep('step-1'); // Go to step 1 (ID input)
//     showModal(adminPanelModal);
// }

// function switchAdminPanelStep(stepId) {
//     console.log('switchAdminPanelStep: Switching admin panel to:', stepId);
//     adminStep1.classList.add('hidden');
//     adminStep2.classList.add('hidden');

//     if (stepId === 'step-1') {
//         adminStep1.classList.remove('hidden');
//         adminStep1.classList.add('active-admin-step');
//         adminStep2.classList.remove('active-admin-step');
//     } else if (stepId === 'step-2') {
//         adminStep2.classList.remove('hidden');
//         adminStep2.classList.add('active-admin-step');
//         adminStep1.classList.remove('active-admin-step');
//     }
// }

// async function handleAdminEnterUserId() {
//     console.log('handleAdminEnterUserId: Attempting to fetch user for admin panel.');
//     showMessage(adminStep1Message, '', 'hidden', 0);
//     const userId = adminUserIdInput.value.trim();

//     if (!userId) {
//         showMessage(adminStep1Message, 'Please enter a user ID.', 'error');
//         return;
//     }

//     try {
//         // Fetch user data using the new admin API endpoint
//         const userData = await apiCall(`/admin/user/${userId}`, 'GET');
//         adminManagedUser = userData;
//         console.log('handleAdminEnterUserId: Fetched user for admin:', adminManagedUser);

//         // Populate step 2 with user data
//         adminManagedUsername.textContent = adminManagedUser.username;
//         adminManagedUserId.textContent = adminManagedUser._id;
//         adminManagedDiscordId.textContent = adminManagedUser.discordId || 'N/A';
//         adminManagedDiscordUsername.textContent = adminManagedUser.discordUsername ? `${adminManagedUser.discordUsername}#${adminManagedUser.discordDiscriminator || 'XXXX'}` : 'N/A';

//         // Clear messages for admin step 2 forms
//         showMessage(adminStep2Message, '', 'hidden', 0);
//         showMessage(adminUsernameUpdateMessage, '', 'hidden', 0);
//         showMessage(adminPasswordResetMessage, '', 'hidden', 0);
//         showMessage(adminCategoriesMessage, '', 'hidden', 0);
//         showMessage(adminTasksMessage, '', 'hidden', 0);

//         // Populate update username field
//         adminNewUsernameInput.value = adminManagedUser.username;
//         adminNewPasswordInput.value = ''; // Clear password field

//         // Load categories and cards for the managed user
//         await loadAdminManagedUserCategories();
//         await loadAdminManagedUserCards();

//         switchAdminPanelStep('step-2');
//     } catch (error) {
//         console.error('handleAdminEnterUserId: Error fetching user:', error);
//         showMessage(adminStep1Message, error.message, 'error');
//     }
// }

// async function handleAdminUpdateUsername(event) {
//     event.preventDefault();
//     if (!adminManagedUser) return;
//     console.log('handleAdminUpdateUsername: Updating username for managed user:', adminManagedUser._id);
//     showMessage(adminUsernameUpdateMessage, '', 'hidden', 0);

//     const newUsername = adminNewUsernameInput.value.trim();
//     if (!newUsername) {
//         showMessage(adminUsernameUpdateMessage, 'New username cannot be empty.', 'error');
//         return;
//     }
//     if (newUsername === adminManagedUser.username) {
//         showMessage(adminUsernameUpdateMessage, 'Username is already up to date.', 'success');
//         return;
//     }

//     try {
//         const data = await apiCall(`/admin/user/${adminManagedUser._id}/username`, 'PUT', { username: newUsername });
//         adminManagedUser.username = data.user.username; // Update local state
//         adminManagedUsername.textContent = data.user.username; // Update display
//         showMessage(adminUsernameUpdateMessage, 'Username updated successfully!', 'success');
//         console.log('handleAdminUpdateUsername: Username updated for managed user.');
//     } catch (error) {
//         console.error('handleAdminUpdateUsername: Error updating username for managed user:', error);
//         showMessage(adminUsernameUpdateMessage, error.message, 'error');
//     }
// }

// async function handleAdminResetPassword(event) {
//     event.preventDefault();
//     if (!adminManagedUser) return;
//     console.log('handleAdminResetPassword: Resetting password for managed user:', adminManagedUser._id);
//     showMessage(adminPasswordResetMessage, '', 'hidden', 0);

//     const newPassword = adminNewPasswordInput.value.trim();
//     if (!newPassword) {
//         showMessage(adminPasswordResetMessage, 'New password cannot be empty.', 'error');
//         return;
//     }

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/password`, 'PUT', { newPassword });
//         showMessage(adminPasswordResetMessage, 'Password reset successfully!', 'success');
//         adminNewPasswordInput.value = ''; // Clear password field
//         console.log('handleAdminResetPassword: Password reset for managed user.');
//     } catch (error) {
//         console.error('handleAdminResetPassword: Error resetting password for managed user:', error);
//         showMessage(adminPasswordResetMessage, error.message, 'error');
//     }
// }

// async function loadAdminManagedUserCategories() {
//     if (!adminManagedUser) return;
//     console.log('loadAdminManagedUserCategories: Fetching categories for managed user:', adminManagedUser._id);
//     try {
//         const userCategories = await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET');
//         adminCategoriesList.innerHTML = ''; // Clear previous list
//         if (userCategories.length === 0) {
//             adminCategoriesList.innerHTML = '<p class="text-gray-400 text-sm">No categories for this user.</p>';
//         } else {
//             userCategories.forEach(category => {
//                 const categoryDiv = document.createElement('div');
//                 categoryDiv.className = 'flex justify-between items-center bg-gray-700 p-2 rounded-md mb-2';
//                 categoryDiv.innerHTML = `
//                     <span class="text-white">${category.name}</span>
//                     <button class="text-red-400 hover:text-red-600 transition-colors ml-2 delete-admin-category-btn" data-category-id="${category._id}">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
//                     </button>
//                 `;
//                 adminCategoriesList.appendChild(categoryDiv);
//             });
//             // Attach event listeners after rendering
//             document.querySelectorAll('.delete-admin-category-btn').forEach(button => {
//                 button.onclick = () => showConfirmation('Are you sure you want to delete this category and its tasks for this user?', () => handleDeleteAdminCategory(button.dataset.categoryId));
//             });
//         }
//         showMessage(adminCategoriesMessage, '', 'hidden', 0); // Clear message
//     } catch (error) {
//         console.error('loadAdminManagedUserCategories: Error fetching categories:', error);
//         showMessage(adminCategoriesMessage, `Error loading categories: ${error.message}`, 'error');
//     }
// }

// async function handleAdminAddCategory(event) {
//     event.preventDefault();
//     if (!adminManagedUser) return;
//     console.log('handleAdminAddCategory: Adding category for managed user:', adminManagedUser._id);
//     showMessage(adminCategoriesMessage, '', 'hidden', 0);

//     const categoryName = adminAddCategoryInput.value.trim();
//     if (!categoryName) {
//         showMessage(adminCategoriesMessage, 'Category name cannot be empty.', 'error');
//         return;
//     }

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'POST', { name: categoryName });
//         showMessage(adminCategoriesMessage, 'Category added successfully!', 'success');
//         adminAddCategoryInput.value = '';
//         await loadAdminManagedUserCategories(); // Refresh list
//         await loadAdminManagedUserCards(); // Also refresh cards as a category was added
//     } catch (error) {
//         console.error('handleAdminAddCategory: Error adding category:', error);
//         showMessage(adminCategoriesMessage, error.message, 'error');
//     }
// }

// async function handleDeleteAdminCategory(categoryId) {
//     if (!adminManagedUser) return;
//     console.log('handleDeleteAdminCategory: Deleting category for managed user:', adminManagedUser._id, 'category ID:', categoryId);
//     showMessage(adminCategoriesMessage, '', 'hidden', 0);

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/categories/${categoryId}`, 'DELETE');
//         showMessage(adminCategoriesMessage, 'Category deleted successfully!', 'success');
//         await loadAdminManagedUserCategories(); // Refresh list
//         await loadAdminManagedUserCards(); // Also refresh cards as a category was deleted
//     } catch (error) {
//         console.error('handleDeleteAdminCategory: Error deleting category:', error);
//         showMessage(adminCategoriesMessage, error.message, 'error');
//     }
// }

// async function loadAdminManagedUserCards() {
//     if (!adminManagedUser) return;
//     console.log('loadAdminManagedUserCards: Fetching cards for managed user:', adminManagedUser._id);
//     try {
//         const userCards = await apiCall(`/admin/user/${adminManagedUser._id}/cards`, 'GET');
//         adminTasksList.innerHTML = ''; // Clear previous list
//         if (userCards.length === 0) {
//             adminTasksList.innerHTML = '<p class="text-gray-400 text-sm">No tasks for this user.</p>';
//         } else {
//             userCards.forEach(card => {
//                 const cardDiv = document.createElement('div');
//                 cardDiv.className = 'flex justify-between items-center bg-gray-700 p-2 rounded-md mb-2';
//                 cardDiv.innerHTML = `
//                     <span class="text-white text-sm font-semibold">${card.title}</span>
//                     <span class="text-gray-300 text-xs italic ml-2">(${card.category})</span>
//                     <div class="flex items-center ml-auto">
//                         <button class="text-blue-400 hover:text-blue-600 transition-colors edit-admin-task-btn mr-1" data-card-id="${card._id}" data-card-title="${card.title}" data-card-description="${card.description}" data-card-category="${card.category}">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
//                         </button>
//                         <button class="text-red-400 hover:text-red-600 transition-colors delete-admin-task-btn" data-card-id="${card._id}">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
//                         </button>
//                     </div>
//                 `;
//                 adminTasksList.appendChild(cardDiv);
//             });

//             // Populate category select for adding new tasks for managed user
//             adminAddTaskCategorySelect.innerHTML = '';
//             const managedUserCategories = await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET');
//             if (managedUserCategories.length === 0) {
//                 const option = document.createElement('option');
//                 option.value = '';
//                 option.textContent = 'No categories for this user';
//                 option.disabled = true;
//                 option.selected = true;
//                 adminAddTaskCategorySelect.appendChild(option);
//             } else {
//                 managedUserCategories.forEach(cat => {
//                     const option = document.createElement('option');
//                     option.value = cat.name;
//                     option.textContent = cat.name;
//                     adminAddTaskCategorySelect.appendChild(option);
//                 });
//                 adminAddTaskCategorySelect.value = managedUserCategories[0].name; // Select first by default
//             }


//             // Attach event listeners after rendering
//             document.querySelectorAll('.edit-admin-task-btn').forEach(button => {
//                 button.onclick = () => openAdminEditCardModal({
//                     _id: button.dataset.cardId,
//                     title: button.dataset.cardTitle,
//                     description: button.dataset.cardDescription,
//                     category: button.dataset.cardCategory
//                 });
//             });
//             document.querySelectorAll('.delete-admin-task-btn').forEach(button => {
//                 button.onclick = () => showConfirmation('Are you sure you want to delete this task for this user?', () => handleDeleteAdminCard(button.dataset.cardId));
//             });
//         }
//         showMessage(adminTasksMessage, '', 'hidden', 0);
//     } catch (error) {
//         console.error('loadAdminManagedUserCards: Error fetching cards:', error);
//         showMessage(adminTasksMessage, `Error loading tasks: ${error.message}`, 'error');
//     }
// }

// async function handleAdminAddTask(event) {
//     event.preventDefault();
//     if (!adminManagedUser) return;
//     console.log('handleAdminAddTask: Adding task for managed user:', adminManagedUser._id);
//     showMessage(adminTasksMessage, '', 'hidden', 0);

//     const title = adminAddTaskTitleInput.value.trim();
//     const description = adminAddTaskDescInput.value.trim();
//     const category = adminAddTaskCategorySelect.value;

//     if (!title || !description || !category) {
//         showMessage(adminTasksMessage, 'All fields are required.', 'error');
//         return;
//     }

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/cards`, 'POST', { title, description, category });
//         showMessage(adminTasksMessage, 'Task added successfully!', 'success');
//         adminAddTaskTitleInput.value = '';
//         adminAddTaskDescInput.value = '';
//         await loadAdminManagedUserCards(); // Refresh list
//     } catch (error) {
//         console.error('handleAdminAddTask: Error adding task:', error);
//         showMessage(adminTasksMessage, error.message, 'error');
//     }
// }

// // Re-using addEditCardModal for admin purposes, but changing its behavior
// function openAdminEditCardModal(cardToEdit) {
//     console.log('openAdminEditCardModal: Opening card modal for admin edit. Card:', cardToEdit._id);
//     hideModal(adminPanelModal); // Temporarily hide admin panel
//     editingCardData = cardToEdit; // Set the card to be edited
//     cardForm.reset();

//     cardModalTitle.textContent = 'Admin Edit Task';
//     cardTitleInput.value = cardToEdit.title;
//     cardDescriptionInput.value = cardToEdit.description;
//     cardCategorySelect.value = cardToEdit.category;
//     cardSubmitBtn.textContent = 'Admin Save Changes';

//     // Populate category select with categories of the *managed user*
//     cardCategorySelect.innerHTML = '';
//     apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET')
//         .then(managedUserCategories => {
//             if (managedUserCategories.length === 0) {
//                 const option = document.createElement('option');
//                 option.value = '';
//                 option.textContent = 'No categories for this user';
//                 option.disabled = true;
//                 option.selected = true;
//                 cardCategorySelect.appendChild(option);
//             } else {
//                 managedUserCategories.forEach(cat => {
//                     const option = document.createElement('option');
//                     option.value = cat.name;
//                     option.textContent = cat.name;
//                     cardCategorySelect.appendChild(option);
//                 });
//                 cardCategorySelect.value = cardToEdit.category; // Select current category
//             }
//         })
//         .catch(error => {
//             console.error('openAdminEditCardModal: Error loading managed user categories:', error);
//             showMessage(cardFormMessage, `Error loading categories for editing: ${error.message}`, 'error');
//         });

//     // Temporarily override handleCardFormSubmit for admin save action
//     cardForm.removeEventListener('submit', handleCardFormSubmit);
//     cardForm.addEventListener('submit', handleAdminEditCardSubmit, { once: true }); // Use once to remove after first submit

//     showMessage(cardFormMessage, '', 'hidden', 0);
//     showModal(addEditCardModal);
// }

// // New submit handler specifically for admin editing a card
// async function handleAdminEditCardSubmit(event) {
//     event.preventDefault();
//     if (!adminManagedUser || !editingCardData) return;
//     console.log('handleAdminEditCardSubmit: Admin saving changes for task:', editingCardData._id);
//     showMessage(cardFormMessage, '', 'hidden', 0);

//     const title = cardTitleInput.value.trim();
//     const description = cardDescriptionInput.value.trim();
//     const category = cardCategorySelect.value;

//     if (!title || !description || !category) {
//         showMessage(cardFormMessage, 'All fields are required.', 'error');
//         return;
//     }

//     const cardData = { title, description, category };

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/cards/${editingCardData._id}`, 'PUT', cardData);
//         showMessage(cardFormMessage, 'Task updated successfully by admin!', 'success');
//         cardForm.reset();
//         hideModal(addEditCardModal);
//         await loadAdminManagedUserCards(); // Refresh the admin view's task list
//         showModal(adminPanelModal); // Show admin panel again
//         console.log('handleAdminEditCardSubmit: Task updated by admin.');
//     } catch (error) {
//         console.error('handleAdminEditCardSubmit: Error updating task by admin:', error);
//         showMessage(cardFormMessage, error.message, 'error');
//     } finally {
//         // Re-attach the regular handleCardFormSubmit for other uses of the modal
//         cardForm.removeEventListener('submit', handleAdminEditCardSubmit);
//         cardForm.addEventListener('submit', handleCardFormSubmit);
//     }
// }


// async function handleDeleteAdminCard(cardId) {
//     if (!adminManagedUser) return;
//     console.log('handleDeleteAdminCard: Deleting card for managed user:', adminManagedUser._id, 'card ID:', cardId);
//     showMessage(adminTasksMessage, '', 'hidden', 0);

//     try {
//         await apiCall(`/admin/user/${adminManagedUser._id}/cards/${cardId}`, 'DELETE');
//         showMessage(adminTasksMessage, 'Task deleted successfully!', 'success');
//         await loadAdminManagedUserCards(); // Refresh list
//     } catch (error) {
//         console.error('handleDeleteAdminCard: Error deleting task:', error);
//         showMessage(adminTasksMessage, error.message, 'error');
//     }
// }

// async function handleAdminDeleteUser() {
//     if (!adminManagedUser) return;
//     console.log('handleAdminDeleteUser: Deleting managed user:', adminManagedUser._id);
//     showMessage(adminStep2Message, '', 'hidden', 0);

//     showConfirmation(`Are you ABSOLUTELY sure you want to delete user "${adminManagedUser.username}" (${adminManagedUser._id})? This action is irreversible and will delete ALL their data!`, async () => {
//         try {
//             await apiCall(`/admin/user/${adminManagedUser._id}`, 'DELETE');
//             showAppStatusMessage(`User "${adminManagedUser.username}" and all their data deleted successfully!`, 'success');
//             hideModal(adminPanelModal);
//             adminUserIdInput.value = ''; // Clear input for next admin session
//             adminManagedUser = null; // Clear state
//             console.log('handleAdminDeleteUser: User deleted by admin.');
//         } catch (error) {
//             console.error('handleAdminDeleteUser: Error deleting user:', error);
//             showMessage(adminStep2Message, error.message, 'error');
//         }
//     });
// }

// // --- Event Listeners (Initialized on DOMContentLoaded) ---
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOMContentLoaded: Initializing event listeners.');
//     // Auth View Listeners
//     authForm.addEventListener('submit', handleAuthSubmit);
//     authToggleLink.addEventListener('click', () => {
//         setAppView(currentAuthViewType === 'login' ? 'register' : 'login');
//     });

//     // Board View Listeners
//     logoutBtn.addEventListener('click', logoutUser);
//     settingsLogoutBtn.addEventListener('click', logoutUser);
//     settingsBtn.addEventListener('click', renderSettingsModal);
//     addCategoryBtn.addEventListener('click', () => {
//         showModal(addCategoryModal);
//         showMessage(addCategoryMessage, '', 'hidden', 0);
//         newCategoryNameInput.value = '';
//     });
//     addCardBtn.addEventListener('click', () => openAddEditCardModal());

//     // Modals Close Buttons (unified handler)
//     document.querySelectorAll('.close-button').forEach(button => {
//         button.addEventListener('click', (event) => {
//             const modalId = event.target.dataset.modal;
//             const modalElement = document.getElementById(modalId);
//             if (modalElement) {
//                 hideModal(modalElement);
//                 console.log('Modal closed by close button:', modalId);
//                 // If closing admin modal, reset to step 1
//                 if (modalId === 'admin-panel-modal') {
//                     switchAdminPanelStep('step-1');
//                     adminUserIdInput.value = '';
//                     adminManagedUser = null;
//                 }
//                  // If closing add/edit card modal that was opened from admin panel, re-open admin panel
//                 if (modalId === 'add-edit-card-modal' && adminManagedUser) {
//                     showModal(adminPanelModal);
//                 }
//             }
//         });
//     });

//     // Modals Click Outside (unified handler for main modals)
//     document.querySelectorAll('.modal').forEach(modal => {
//         modal.addEventListener('click', (event) => {
//             if (event.target === modal) {
//                 hideModal(modal);
//                 console.log('Modal closed by clicking outside:', modal.id);
//                 // If closing admin modal, reset to step 1
//                 if (modal.id === 'admin-panel-modal') {
//                     switchAdminPanelStep('step-1');
//                     adminUserIdInput.value = '';
//                     adminManagedUser = null;
//                 }
//                  // If closing add/edit card modal that was opened from admin panel, re-open admin panel
//                 if (modal.id === 'add-edit-card-modal' && adminManagedUser) {
//                     showModal(adminPanelModal);
//                 }
//             }
//         });
//     });

//     // Add Category Modal Listeners
//     addCategoryForm.addEventListener('submit', handleAddCategoryFormSubmit);

//     // Add/Edit Card Modal Listeners (default handler)
//     cardForm.addEventListener('submit', handleCardFormSubmit);

//     // Settings Modal Listeners
//     updateUsernameForm.addEventListener('submit', handleUpdateUsername);
//     updatePasswordForm.addEventListener('submit', handleUpdatePassword);
//     connectDiscordBtn.addEventListener('click', handleConnectDiscord);

//     // Settings Tab Button Listeners
//     tabButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const tabId = button.dataset.tabId;
//             switchSettingsTab(tabId);
//         });
//     });

//     // Confirmation Modal Listeners
//     confirmActionBtn.addEventListener('click', () => {
//         if (currentConfirmationAction) {
//             currentConfirmationAction();
//             console.log('Confirmation action executed.');
//         }
//         hideConfirmation();
//     });
//     cancelActionBtn.addEventListener('click', hideConfirmation);

//     // *** NEW ADMIN PANEL EVENT LISTENERS ***
//     adminPanelBtn.addEventListener('click', showAdminPanelModal);
//     adminNextBtn.addEventListener('click', handleAdminEnterUserId);
//     adminBackToIdInputBtn.addEventListener('click', () => {
//         switchAdminPanelStep('step-1');
//         adminUserIdInput.value = ''; // Clear input for next attempt
//         adminManagedUser = null; // Clear managed user data
//         showMessage(adminStep1Message, '', 'hidden', 0);
//     });

//     adminUpdateUsernameForm.addEventListener('submit', handleAdminUpdateUsername);
//     adminResetPasswordForm.addEventListener('submit', handleAdminResetPassword);
//     adminDeleteUserBtn.addEventListener('click', handleAdminDeleteUser);

//     adminAddCategoryForm.addEventListener('submit', handleAdminAddCategory);
//     adminAddTaskForm.addEventListener('submit', handleAdminAddTask);

//     // Initial check on load to determine which view to show
//     checkAuthAndRender();

//     // Listener for clicks anywhere on the document to hide the options menu
//     document.addEventListener('click', (event) => {
//         const target = event.target;
//         const isClickInsideMenu = cardOptionsMenu.contains(target);
//         const isClickOnToggleButton = activeCardOptionsMenuButton && activeCardOptionsMenuButton.contains(target);

//         if (cardOptionsMenu.classList.contains('show') && !isClickInsideMenu && !isClickOnToggleButton) {
//             hideCardOptionsMenu();
//         }
//     });
//     console.log('DOMContentLoaded: Initialization complete.');
// });

// --- Global DOM Element References (cached for performance) ---
const API_BASE_URL = 'https://taskfllow.onrender.com/api'; // Your deployed Render backend API URL

const authView = document.getElementById('auth-view');
const boardView = document.getElementById('board-view');

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authUsernameInput = document.getElementById('auth-username');
const authPasswordInput = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggleLink = document.getElementById('auth-toggle-link');
const authMessage = document.getElementById('auth-message');

const welcomeUsernameSpan = document.getElementById('welcome-username');
const logoutBtn = document.getElementById('logout-btn');
const settingsBtn = document.getElementById('settings-btn');
const appStatusMessage = document.getElementById('app-status-message');

const kanbanBoardContainer = document.getElementById('kanban-board-container');
const addCardBtn = document.getElementById('add-card-btn');
const addCategoryBtn = document.getElementById('add-category-btn');

// Modals
const addCategoryModal = document.getElementById('add-category-modal');
const addCategoryForm = document.getElementById('add-category-form');
const newCategoryNameInput = document.getElementById('new-category-name');
const addCategoryMessage = document.getElementById('add-category-message');

const addEditCardModal = document.getElementById('add-edit-card-modal');
const cardModalTitle = document.getElementById('card-modal-title');
const cardForm = document.getElementById('card-form');
const cardTitleInput = document.getElementById('card-title-input');
const cardDescriptionInput = document.getElementById('card-description-input');
const cardCategorySelect = document.getElementById('card-category-select');
const cardSubmitBtn = document.getElementById('card-submit-btn');
const cardFormMessage = document.getElementById('card-form-message');

const settingsModal = document.getElementById('settings-modal');
const settingsUsernameDisplay = document.getElementById('settings-username-display');
const settingsUserIdDisplay = document.getElementById('settings-user-id-display');
const settingsDiscordStatus = document.getElementById('settings-discord-status');
const updateUsernameForm = document.getElementById('update-username-form');
const settingsNewUsernameInput = document.getElementById('settings-new-username');
const usernameUpdateMessage = document.getElementById('username-update-message');
const updatePasswordForm = document.getElementById('update-password-form');
const settingsOldPasswordInput = document.getElementById('settings-old-password');
const settingsNewPasswordInput = document.getElementById('settings-new-password');
const passwordUpdateMessage = document.getElementById('password-update-message');
const connectDiscordBtn = document.getElementById('connect-discord-btn');
const discordConnectMessage = document.getElementById('discord-connect-message');
const settingsLogoutBtn = document.getElementById('settings-logout-btn');

// Settings Tabs Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessage = document.getElementById('confirmation-message');
const confirmActionBtn = document.getElementById('confirm-action-btn');
const cancelActionBtn = document.getElementById('cancel-action-btn');

const cardOptionsMenu = document.getElementById('card-options-menu');
const editCardMenuItem = document.getElementById('edit-card-menu-item');
const deleteCardMenuItem = document.getElementById('delete-card-menu-item');

// *** NEW ADMIN PANEL DOM ELEMENTS ***
const adminPanelBtn = document.getElementById('admin-panel-btn'); // Button in settings modal
const adminPanelModal = document.getElementById('admin-panel-modal'); // The admin panel modal itself
const adminStep1 = document.getElementById('admin-step-1'); // User ID input step
const adminUserIdInput = document.getElementById('admin-user-id-input');
const adminStep1Message = document.getElementById('admin-step-1-message');
const adminNextBtn = document.getElementById('admin-next-btn');

const adminStep2 = document.getElementById('admin-step-2'); // User management step
const adminManagedUsername = document.getElementById('admin-managed-username');
const adminManagedUserId = document.getElementById('admin-managed-user-id');
const adminManagedDiscordId = document.getElementById('admin-managed-discord-id');
const adminManagedDiscordUsername = document.getElementById('admin-managed-discord-username');
const adminStep2Message = document.getElementById('admin-step-2-message');

const adminUpdateUsernameForm = document.getElementById('admin-update-username-form');
const adminNewUsernameInput = document.getElementById('admin-new-username-input');
const adminUsernameUpdateMessage = document.getElementById('admin-username-update-message');

const adminResetPasswordForm = document.getElementById('admin-reset-password-form');
const adminNewPasswordInput = document.getElementById('admin-new-password-input');
const adminPasswordResetMessage = document.getElementById('admin-password-reset-message');

const adminCategoriesMessage = document.getElementById('admin-categories-message');
const adminCategoriesList = document.getElementById('admin-categories-list');
const adminAddCategoryForm = document.getElementById('admin-add-category-form');
const adminAddCategoryInput = document.getElementById('admin-add-category-input');

const adminTasksMessage = document.getElementById('admin-tasks-message');
const adminTasksList = document.getElementById('admin-tasks-list');
const adminAddTaskForm = document.getElementById('admin-add-task-form');
const adminAddTaskTitleInput = document.getElementById('admin-add-task-title-input');
const adminAddTaskDescInput = document.getElementById('admin-add-task-desc-input');
const adminAddTaskCategorySelect = document.getElementById('admin-add-task-category-select');

const adminDeleteUserBtn = document.getElementById('admin-delete-user-btn');
const adminBackToIdInputBtn = document.getElementById('admin-back-to-id-input-btn');


// --- Global State Variables ---
let currentAuthViewType = 'login'; // 'login' or 'register'
let currentUser = null; // Stores { userId, username, discordId, discordUsername, discordDiscriminator, isAdmin }
let categories = []; // Cache for current categories for the logged-in user
let cards = []; // Cache for current cards for the logged-in user
let currentEditingCardId = null; // ID of card being edited
let currentConfirmationAction = null; // Stores the function to call on confirmation

// *** NEW ADMIN STATE ***
// Your Discord User ID that is allowed to access the admin panel
// This is hardcoded on the frontend for UI visibility, actual security is on the backend.
const ADMIN_DISCORD_ID_FRONTEND = '1270842894466547825'; // REPLACE WITH YOUR ACTUAL DISCORD USER ID
let adminManagedUser = null; // Stores the user object currently being managed by the admin


// --- Utility Functions ---

/**
 * Sets the authentication token in localStorage.
 * @param {string} token - The JWT token.
 */
function setAuthToken(token) {
    try {
        localStorage.setItem('authToken', token);
        console.log('setAuthToken: Token successfully saved to localStorage. Length:', token ? token.length : 0);
    } catch (e) {
        console.error('setAuthToken: Failed to save token to localStorage:', e);
        showAppStatusMessage('Error: Could not save session. Please check browser settings (e.g., private mode, storage limits).', 'error', 0);
    }
}

/**
 * Gets the authentication token from localStorage.
 * @returns {string|null} The JWT token or null if not found.
 */
function getAuthToken() {
    try {
        const token = localStorage.getItem('authToken');
        console.log('getAuthToken: Retrieved token from localStorage. Is token present?', !!token, 'Length:', token ? token.length : 0);
        return token;
    } catch (e) {
        console.error('getAuthToken: Failed to retrieve token from localStorage:', e);
        return null;
    }
}

/**
 * Removes the authentication token from localStorage.
 */
function removeAuthToken() {
    try {
        localStorage.removeItem('authToken');
        currentUser = null; // Clear current user data
        console.log('removeAuthToken: Token successfully removed from localStorage.');
    } catch (e) {
        console.error('removeAuthToken: Failed to remove token from localStorage:', e);
    }
}

/**
 * Displays a status/error message in the designated area.
 * @param {HTMLElement} element - The DOM element to display the message in.
 * @param {string} message - The message text.
 * @param {string} type - 'success', 'error', 'info'.
 * @param {number} duration - How long the message should display in ms (0 for persistent).
 */
function showMessage(element, message, type = 'error', duration = 3000) {
    element.textContent = message;
    element.classList.remove('hidden', 'error-message', 'success-message', 'info-message'); // Clear previous types
    if (type === 'error') {
        element.classList.add('error-message');
    } else if (type === 'success') {
        element.classList.add('success-message');
    } else {
        element.classList.add('info-message');
    }
    element.classList.remove('hidden');

    if (duration > 0) {
        setTimeout(() => {
            element.classList.add('hidden');
            element.textContent = '';
        }, duration);
    }
}

/**
 * Displays a modal with a fade-in animation.
 * @param {HTMLElement} modalElement - The modal DOM element.
 */
function showModal(modalElement) {
    modalElement.style.display = 'flex'; // Ensure display is not 'none' for animation to work
    modalElement.classList.remove('hidden-fade'); // Remove fade-out class if present
    modalElement.classList.add('visible'); // Trigger fade-in animation
}

/**
 * Hides a modal with a fade-out animation.
 * @param {HTMLElement} modalElement - The modal DOM element.
 */
function hideModal(modalElement) {
    modalElement.classList.remove('visible');
    modalElement.classList.add('hidden-fade'); // Trigger fade-out animation
    // After animation, set display to none to remove from layout and improve accessibility
    modalElement.addEventListener('animationend', function handler() {
        modalElement.classList.remove('hidden-fade'); // Clean up animation class
        modalElement.style.display = 'none'; // Fully hide the modal
        modalElement.removeEventListener('animationend', handler); // Remove listener
    }, { once: true }); // Ensure listener runs only once
}


// --- API Call Wrapper (Enhanced Error Handling and Logging) ---
async function apiCall(endpoint, method = 'GET', data = null) {
    console.log(`\napiCall: Initiating ${method} request to ${endpoint}`);
    const token = getAuthToken(); // Always get the latest token right before the call

    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('apiCall: Authorization header being sent: Bearer (token present)');
    } else {
        console.warn('apiCall: No token found for this request. Authorization header will NOT be sent.');
    }

    const config = {
        method,
        headers,
    };
    if (data) {
        config.body = JSON.stringify(data);
    }
    console.log('apiCall: Fetch config:', config);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const responseData = await response.json();
        console.log(`apiCall: Response status for ${endpoint}: ${response.status}`);
        console.log('apiCall: Response Data:', responseData);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.warn(`apiCall: Received ${response.status}. Session invalid/expired. Forcing logout.`);
                removeAuthToken();
                setAppView('login');
                showAppStatusMessage('Your session has expired or is invalid. Please log in or register again.', 'error', 0);
            }
            throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
        }
        return responseData;
    } catch (error) {
        console.error(`API Call Error (${method} ${endpoint}):`, error);
        throw error;
    }
}


// --- View Management ---

/**
 * Switches the active view of the application.
 * @param {string} viewName - 'login', 'register', or 'board'.
 */
function setAppView(viewName) {
    console.log('setAppView: Switching to view:', viewName);
    authView.classList.add('hidden');
    boardView.classList.add('hidden');

    if (viewName === 'board') {
        boardView.classList.remove('hidden');
    } else {
        authView.classList.remove('hidden');
        if (viewName === 'login') {
            currentAuthViewType = 'login';
            authTitle.textContent = 'Login';
            authSubmitBtn.textContent = 'Login';
            authToggleLink.textContent = 'Register here.';
        } else { // register
            currentAuthViewType = 'register';
            authTitle.textContent = 'Create Account';
            authSubmitBtn.textContent = 'Register';
            authToggleLink.textContent = 'Login here.';
        }
        authForm.reset();
        authMessage.classList.add('hidden');
    }
}

/**
 * Loads board data and handles Discord callback parameters.
 * Called specifically after successful login/registration or on initial page load if authenticated.
 */
async function loadBoardDataAndRender() {
    console.log('--- ENTERING loadBoardDataAndRender --- Starting board data load and Discord param check.');
    const urlParams = new URLSearchParams(window.location.search);
    const discordStatus = urlParams.get('discord_connect_status');
    const discordMessage = urlParams.get('message');
    const discordToken = urlParams.get('token');
    const discordUsername = urlParams.get('discord_username');
    const discordDiscriminator = urlParams.get('discord_discriminator');

    if (discordStatus) {
        console.log('loadBoardDataAndRender: Discord callback parameters detected.');
        const statusType = discordStatus === 'success' ? 'success' : (discordStatus === 'info' ? 'info' : 'error');
        let displayMessage = decodeURIComponent(discordMessage || 'Unknown status.');

        if (discordToken) {
            console.log('loadBoardDataAndRender: Received new token from Discord callback. Logging in with it.');
            setAuthToken(discordToken);
            // After setting token, re-check auth to update currentUser and fetch board
            await checkAuthAndRender(); // This will re-trigger the board load
        }

        if (discordStatus === 'success' && discordUsername && discordDiscriminator) {
            displayMessage = `Successfully connected Discord: ${decodeURIComponent(discordUsername)}#${decodeURIComponent(discordDiscriminator)}. (You can manage this in settings).`;
        } else if (discordMessage) {
            displayMessage = decodeURIComponent(discordMessage);
        }

        showAppStatusMessage(`Discord Connection: ${displayMessage}`, statusType);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }

    await fetchCategoriesAndCards();
    console.log('loadBoardDataAndRender: Board data loaded and rendered.');
}


// --- Authentication Logic ---

async function handleAuthSubmit(event) {
    event.preventDefault();
    console.log('--- ENTERING handleAuthSubmit --- Form submission for', currentAuthViewType);
    showMessage(authMessage, '', 'hidden', 0);

    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) {
        showMessage(authMessage, 'Please enter both username and password.', 'error');
        return;
    }

    let endpoint = currentAuthViewType === 'register' ? '/register' : '/login';

    try {
        const data = await apiCall(endpoint, 'POST', { username, password });
        console.log('handleAuthSubmit: API call successful, received data:', data);
        setAuthToken(data.token);
        // Populate currentUser including the isAdmin flag based on Discord ID
        currentUser = {
            userId: data.userId,
            username: data.username,
            discordId: data.discordId,
            discordUsername: data.discordUsername,
            discordDiscriminator: data.discordDiscriminator,
            isAdmin: data.discordId === ADMIN_DISCORD_ID_FRONTEND // Set admin flag here
        };
        welcomeUsernameSpan.textContent = data.username;

        setAppView('board');
        setTimeout(loadBoardDataAndRender, 100);
    } catch (error) {
        showMessage(authMessage, error.message, 'error');
    }
}

async function checkAuthAndRender() {
    console.log('--- ENTERING checkAuthAndRender --- Starting authentication check on page load.');
    const token = getAuthToken();

    if (token) {
        console.log('checkAuthAndRender: Token found, attempting to fetch user profile.');
        try {
            const userProfile = await apiCall('/profile');
            // Ensure currentUser is fully populated, including Discord details and isAdmin flag
            currentUser = {
                userId: userProfile._id,
                username: userProfile.username,
                discordId: userProfile.discordId,
                discordDiscriminator: userProfile.discordDiscriminator, // Make sure discriminator is retrieved
                discordUsername: userProfile.discordUsername,
                isAdmin: userProfile.discordId === ADMIN_DISCORD_ID_FRONTEND // Set admin flag here
            };
            welcomeUsernameSpan.textContent = userProfile.username;
            console.log('checkAuthAndRender: User profile fetched successfully:', userProfile);

            setAppView('board');
            setTimeout(loadBoardDataAndRender, 100);
        } catch (error) {
            console.error("checkAuthAndRender: Initial profile fetch failed, app should be redirecting to login:", error);
        }
    } else {
        console.log('checkAuthAndRender: No token found on startup. Ensuring clean state and setting app view to login.');
        removeAuthToken();
        setAppView('login');
        showAppStatusMessage('No active session found. Please log in or register.', 'info', 0);
    }
}

function logoutUser() {
    console.log('logoutUser: Initiating logout process.');
    removeAuthToken();
    setAppView('login');
    showAppStatusMessage('Logged out successfully.', 'success');
}

// --- User Profile/Settings Logic ---

// Function to handle tab switching in settings modal
function switchSettingsTab(tabId) {
    console.log('switchSettingsTab: Activating tab:', tabId);
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => {
        content.classList.remove('active-tab-content');
        content.classList.add('hidden');
    });

    const targetButton = document.querySelector(`.tab-button[data-tab-id="${tabId}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.remove('hidden');
        void targetContent.offsetWidth; // Trigger reflow
        targetContent.classList.add('active-tab-content');
    }
}


async function renderSettingsModal() {
    console.log('renderSettingsModal: Opening settings modal.');
    if (!currentUser) {
        console.error('renderSettingsModal: No current user data, cannot render settings.');
        showAppStatusMessage('Error: User data not loaded. Please log in.', 'error');
        return;
    }

    try {
        const updatedUser = await apiCall('/profile');
        currentUser = {
            userId: updatedUser._id,
            username: updatedUser.username,
            discordId: updatedUser.discordId,
            discordDiscriminator: updatedUser.discriminator, // Make sure discriminator is retrieved
            discordUsername: updatedUser.discordUsername,
            isAdmin: updatedUser.discordId === ADMIN_DISCORD_ID_FRONTEND // Re-evaluate admin status
        };
        console.log('renderSettingsModal: User profile refreshed successfully:', currentUser);
    } catch (error) {
        console.error('renderSettingsModal: Error refreshing profile data:', error);
        showAppStatusMessage(`Error refreshing profile data: ${error.message}`, 'error');
        return;
    }

    settingsUsernameDisplay.textContent = currentUser.username;
    settingsUserIdDisplay.textContent = currentUser.userId || 'N/A';

    if (currentUser.discordId) {
        let discordDisplayName = '';
        if (currentUser.discordUsername && currentUser.discordDiscriminator) {
            discordDisplayName = `${currentUser.discordUsername}#${currentUser.discordDiscriminator}`;
        } else {
            discordDisplayName = currentUser.discordId;
        }
        settingsDiscordStatus.textContent = `Discord Connected: ${discordDisplayName}`;
        settingsDiscordStatus.classList.remove('text-red-400');
        settingsDiscordStatus.classList.add('text-green-400', 'settings-discord-status');
        connectDiscordBtn.textContent = 'Discord Connected';
        connectDiscordBtn.disabled = true;
    } else {
        settingsDiscordStatus.textContent = 'Discord Not Connected';
        settingsDiscordStatus.classList.remove('text-green-400');
        settingsDiscordStatus.classList.add('text-red-400', 'settings-discord-status');
        connectDiscordBtn.textContent = 'Connect Discord';
        connectDiscordBtn.disabled = false;
    }

    // *** NEW: Show/Hide Admin Panel button ***
    if (currentUser.isAdmin) {
        adminPanelBtn.classList.remove('hidden');
    } else {
        adminPanelBtn.classList.add('hidden');
    }

    showMessage(usernameUpdateMessage, '', 'hidden', 0);
    showMessage(passwordUpdateMessage, '', 'hidden', 0);
    showMessage(discordConnectMessage, '', 'hidden', 0);

    settingsNewUsernameInput.value = currentUser.username;
    settingsOldPasswordInput.value = '';
    settingsNewPasswordInput.value = '';

    switchSettingsTab('account-info-tab'); // Default to Account Info tab

    showModal(settingsModal);
}

async function handleUpdateUsername(event) {
    event.preventDefault();
    console.log('handleUpdateUsername: Updating username.');
    showMessage(usernameUpdateMessage, '', 'hidden', 0);

    const newUsername = settingsNewUsernameInput.value.trim();
    if (!newUsername) {
        showMessage(usernameUpdateMessage, 'New username cannot be empty.', 'error');
        return;
    }
    if (newUsername === currentUser.username) {
        showMessage(usernameUpdateMessage, 'Username is already up to date.', 'success');
        return;
    }

    try {
        const data = await apiCall('/profile/username', 'PUT', { username: newUsername });
        setAuthToken(data.token);
        currentUser.username = data.username;
        welcomeUsernameSpan.textContent = data.username;
        settingsUsernameDisplay.textContent = data.username;
        showMessage(usernameUpdateMessage, 'Username updated successfully!', 'success');
        console.log('handleUpdateUsername: Username updated successfully.');
    } catch (error) {
        console.error('handleUpdateUsername: Error updating username:', error);
        showMessage(usernameUpdateMessage, error.message, 'error');
    }
}

async function handleUpdatePassword(event) {
    event.preventDefault();
    console.log('handleUpdatePassword: Updating password.');
    showMessage(passwordUpdateMessage, '', 'hidden', 0);

    const oldPassword = settingsOldPasswordInput.value.trim();
    const newPassword = settingsNewPasswordInput.value.trim();

    if (!oldPassword || !newPassword) {
        showMessage(passwordUpdateMessage, 'Both old and new passwords are required.', 'error');
        return;
    }
    if (oldPassword === newPassword) {
        showMessage(passwordUpdateMessage, 'New password cannot be the same as old password.', 'error');
        return;
    }

    try {
        await apiCall('/profile/password', 'PUT', { oldPassword, newPassword });
        showMessage(passwordUpdateMessage, 'Password updated successfully!', 'success');
        settingsOldPasswordInput.value = '';
        settingsNewPasswordInput.value = '';
        console.log('handleUpdatePassword: Password updated successfully.');
    } catch (error) {
        console.error('handleUpdatePassword: Error updating password:', error);
        showMessage(passwordUpdateMessage, error.message, 'error');
    }
}

async function handleConnectDiscord() {
    console.log('handleConnectDiscord: Initiating Discord connection.');
    showMessage(discordConnectMessage, '', 'hidden', 0);
    try {
        const data = await apiCall('/discord/login', 'GET');
        console.log('handleConnectDiscord: Redirecting to Discord URL:', data.redirectUrl);
        window.location.href = data.redirectUrl;
    } catch (error) {
        console.error('handleConnectDiscord: Error connecting Discord:', error);
        showMessage(discordConnectMessage, error.message, 'error');
    }
}


// --- Kanban Board Rendering ---

async function fetchCategoriesAndCards() {
    console.log('--- ENTERING fetchCategoriesAndCards --- Fetching categories and cards.');
    showAppStatusMessage('Loading categories and cards...', 'info', 0);
    try {
        const fetchedCategories = await apiCall('/categories');
        categories = fetchedCategories;
        console.log('fetchCategoriesAndCards: Categories fetched:', categories);

        const fetchedCards = await apiCall('/cards');
        cards = fetchedCards;
        console.log('fetchCategoriesAndCards: Cards fetched:', cards);

        renderKanbanBoard();
        updateAddCardButtonState();
        showAppStatusMessage('Board loaded successfully.', 'success');
    } catch (error) {
        console.error('fetchCategoriesAndCards: Error loading board data:', error);
        showAppStatusMessage(`Error loading board: ${error.message}. You might need to log in again.`, 'error', 0);
    }
}

function renderKanbanBoard() {
    console.log('renderKanbanBoard: Rendering Kanban board.');
    kanbanBoardContainer.innerHTML = '';

    if (categories.length === 0) {
        console.log('renderKanbanBoard: No categories found, displaying message.');
        const noCategoriesMessage = document.createElement('div');
        noCategoriesMessage.className = 'text-center text-gray-500 text-lg w-full mt-10';
        noCategoriesMessage.textContent = 'No categories yet! Click "Add Category" to get started.';
        kanbanBoardContainer.appendChild(noCategoriesMessage);
        return;
    }

    categories.forEach(category => {
        const column = document.createElement('div');
        column.classList.add('kanban-column');
        column.dataset.category = category.name;
        column.dataset.categoryId = category._id;

        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);

        column.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h2>${category.name}</h2>
                <button class="text-red-400 hover:text-red-600 transition-colors delete-category-btn" data-category-id="${category._id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div class="kanban-column-content">
                <!-- Cards will be injected here -->
            </div>
        `;
        kanbanBoardContainer.appendChild(column);

        const columnContent = column.querySelector('.kanban-column-content');
        cards.filter(card => card.category === category.name).forEach(cardData => {
            columnContent.appendChild(createCardElement(cardData));
        });
    });

    document.querySelectorAll('.delete-category-btn').forEach(button => {
        button.onclick = () => {
            const categoryId = button.dataset.categoryId;
            showConfirmation('Are you sure you want to delete this category? All cards in it will also be deleted.', () => handleDeleteCategory(categoryId));
        };
    });
    console.log('renderKanbanBoard: Board rendering complete.');
}

/**
 * Creates and returns a DOM element for a Kanban card.
 * @param {Object} cardData - Object containing _id, title, description, category.
 * @returns {HTMLElement} The created card div element.
 */
function createCardElement(cardData) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('draggable', 'true');
    card.dataset.id = cardData._id;
    card.dataset.category = cardData.category;

    card.innerHTML = `
        <div class="card-header">
            <h3>${cardData.title}</h3>
            <button class="options-btn" data-id="${cardData._id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
        </div>
        <p>${cardData.description}</p>
    `;

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    const optionsButton = card.querySelector('.options-btn');
    optionsButton.addEventListener('click', (e) => {
        e.stopPropagation(); // <--- THIS IS THE FIX: Stop the click from propagating!
        showCardOptionsMenu(cardData, optionsButton);
    });

    return card;
}

/**
 * Shows the main app status message at the top of the board.
 * @param {string} message
 * @param {string} type - 'success', 'error', 'info'
 * @param {number} [duration=3000] - Duration in ms, 0 for permanent
 */
function showAppStatusMessage(message, type = 'info', duration = 3000) {
    appStatusMessage.textContent = message;
    appStatusMessage.className = `text-center p-3 rounded-lg mb-4`;
    if (type === 'error') {
        appStatusMessage.classList.add('bg-red-700', 'text-white');
    } else if (type === 'success') {
        appStatusMessage.classList.add('bg-green-700', 'text-white');
    } else {
        appStatusMessage.classList.add('bg-blue-700', 'text-white');
    }
    appStatusMessage.classList.remove('hidden', 'fade-out');
    appStatusMessage.style.opacity = '1';

    if (duration > 0) {
        setTimeout(() => {
            appStatusMessage.classList.add('fade-out');
            appStatusMessage.addEventListener('transitionend', function handler() {
                appStatusMessage.classList.add('hidden');
                appStatusMessage.removeEventListener('transitionend', handler);
            }, { once: true });
        }, duration);
    }
    console.log(`showAppStatusMessage: Message displayed - ${message} (Type: ${type})`);
}

function updateAddCardButtonState() {
    console.log('updateAddCardButtonState: Updating add card button state.');
    if (categories.length === 0) {
        addCardBtn.disabled = true;
        addCardBtn.classList.add('opacity-50', 'cursor-not-allowed');
        addCardBtn.style.backgroundImage = 'none';
        addCardBtn.style.backgroundColor = 'var(--color-dark-border)';
    } else {
        addCardBtn.disabled = false;
        addCardBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        addCardBtn.style.backgroundImage = '';
        addCardBtn.style.backgroundColor = '';
    }
}


// --- Category CRUD Operations ---

async function handleAddCategoryFormSubmit(event) {
    event.preventDefault();
    console.log('handleAddCategoryFormSubmit: Adding new category.');
    showMessage(addCategoryMessage, '', 'hidden', 0);

    const categoryName = newCategoryNameInput.value.trim();
    if (!categoryName) {
        showMessage(addCategoryMessage, 'Category name cannot be empty.', 'error');
        return;
    }

    try {
        await apiCall('/categories', 'POST', { name: categoryName });
        showMessage(addCategoryMessage, 'Category added successfully!', 'success');
        newCategoryNameInput.value = '';
        hideModal(addCategoryModal);
        fetchCategoriesAndCards();
        console.log('handleAddCategoryFormSubmit: Category added successfully.');
    } catch (error) {
        console.error('handleAddCategoryFormSubmit: Error adding category:', error);
        showMessage(addCategoryMessage, error.message, 'error');
    }
}

async function handleDeleteCategory(categoryId) {
    console.log('handleDeleteCategory: Deleting category with ID:', categoryId);
    try {
        await apiCall(`/categories/${categoryId}`, 'DELETE');
        showAppStatusMessage('Category and its cards deleted successfully!', 'success');
        fetchCategoriesAndCards();
        console.log('handleDeleteCategory: Category deleted successfully.');
    } catch (error) {
        console.error('handleDeleteCategory: Error deleting category:', error);
        showAppStatusMessage(`Error deleting category: ${error.message}`, 'error');
    }
}

// --- Card CRUD Operations ---

let editingCardData = null;

async function handleCardFormSubmit(event) {
    event.preventDefault();
    console.log('handleCardFormSubmit: Submitting card form.');
    showMessage(cardFormMessage, '', 'hidden', 0);

    const title = cardTitleInput.value.trim();
    const description = cardDescriptionInput.value.trim();
    const category = cardCategorySelect.value;

    if (!title || !description || !category) {
        showMessage(cardFormMessage, 'All fields are required.', 'error');
        return;
    }

    const cardData = { title, description, category };

    try {
        if (editingCardData) {
            await apiCall(`/cards/${editingCardData._id}`, 'PUT', cardData);
            showMessage(cardFormMessage, 'Task updated successfully!', 'success');
            console.log('handleCardFormSubmit: Card updated successfully.');
        } else {
            await apiCall('/cards', 'POST', cardData);
            showMessage(cardFormMessage, 'Task added successfully!', 'success');
            console.log('handleCardFormSubmit: Card added successfully.');
        }
        cardForm.reset();
        hideModal(addEditCardModal);
        fetchCategoriesAndCards();
    } catch (error) {
        console.error('handleCardFormSubmit: Error submitting card form:', error);
        showMessage(cardFormMessage, error.message, 'error');
    }
}

function openAddEditCardModal(cardToEdit = null) {
    console.log('openAddEditCardModal: Opening card modal. Editing:', !!cardToEdit);
    editingCardData = cardToEdit;
    cardForm.reset();

    if (cardToEdit) {
        cardModalTitle.textContent = 'Edit Task';
        cardTitleInput.value = cardToEdit.title;
        cardDescriptionInput.value = cardToEdit.description;
        cardCategorySelect.value = cardToEdit.category;
        cardSubmitBtn.textContent = 'Save Changes';
    } else {
        cardModalTitle.textContent = 'Add New Task';
        cardSubmitBtn.textContent = 'Add Task';
    }

    cardCategorySelect.innerHTML = '';
    if (categories.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No categories available';
        option.disabled = true;
        option.selected = true;
        cardCategorySelect.appendChild(option);
        console.warn('openAddEditCardModal: No categories available to populate dropdown.');
    } else {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            cardCategorySelect.appendChild(option);
        });
        if (cardToEdit && categories.some(cat => cat.name === cardToEdit.category)) {
            cardCategorySelect.value = cardToEdit.category;
        } else if (categories.length > 0) {
            cardCategorySelect.value = categories[0].name;
        }
    }
    showMessage(cardFormMessage, '', 'hidden', 0);
    showModal(addEditCardModal);
}

async function handleDeleteCard(cardId) {
    console.log('handleDeleteCard: Deleting card with ID:', cardId);
    try {
        await apiCall(`/cards/${cardId}`, 'DELETE');
        showAppStatusMessage('Card deleted successfully!', 'success');
        fetchCategoriesAndCards();
        console.log('handleDeleteCard: Card deleted successfully.');
    } catch (error) {
        console.error('handleDeleteCard: Error deleting card:', error);
        showAppStatusMessage(`Error deleting card: ${error.message}`, 'error');
    }
}

// --- Card Options Menu Logic ---
let activeCardOptionsMenuButton = null;

function showCardOptionsMenu(cardData, buttonElement) {
    console.log('showCardOptionsMenu: Showing options for card:', cardData._id);
    hideCardOptionsMenu(); // Ensure any previous menu is hidden

    activeCardOptionsMenuButton = buttonElement;
    currentEditingCardId = cardData._id;

    const rect = buttonElement.getBoundingClientRect();
    // Position the menu relative to the button
    cardOptionsMenu.style.top = `${rect.bottom + 5}px`;
    cardOptionsMenu.style.left = `${rect.left}px`;
    cardOptionsMenu.classList.add('show');

    // Set up click handlers for menu items
    editCardMenuItem.onclick = () => {
        openAddEditCardModal(cardData);
        hideCardOptionsMenu();
    };
    deleteCardMenuItem.onclick = () => {
        showConfirmation('Are you sure you want to delete this card?', () => handleDeleteCard(cardData._id));
        hideCardOptionsMenu();
    };

    // Add a delayed event listener to the document to close the menu
    // This delay prevents the *current* click (that opened the menu) from closing it immediately
    setTimeout(() => {
        document.addEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
    }, 0);
}

function hideCardOptionsMenu() {
    console.log('hideCardOptionsMenu: Hiding card options menu.');
    cardOptionsMenu.classList.remove('show');
    document.removeEventListener('click', handleClickOutsideCardOptionsMenu, { capture: true });
    activeCardOptionsMenuButton = null;
    currentEditingCardId = null;
}

function handleClickOutsideCardOptionsMenu(event) {
    // If the click is inside the options menu OR on the button that opened it, do nothing (don't hide)
    if (
        cardOptionsMenu.contains(event.target) ||
        (activeCardOptionsMenuButton && activeCardOptionsMenuButton.contains(event.target))
    ) {
        return;
    }
    // Otherwise, hide the menu
    hideCardOptionsMenu();
}


// --- Drag and Drop Logic ---

let draggedCardElement = null;

function handleDragStart(event) {
    if (event.target.closest('.options-btn')) {
        event.preventDefault(); // Prevent drag if clicking options button
        return;
    }
    draggedCardElement = event.currentTarget;
    draggedCardElement.classList.add('dragging');
    event.dataTransfer.setData('text/plain', draggedCardElement.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
    console.log('handleDragStart: Card drag started for ID:', draggedCardElement.dataset.id);
}

function handleDragEnd(event) {
    if (draggedCardElement) {
        draggedCardElement.classList.remove('dragging');
        draggedCardElement = null;
    }
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
    });
    console.log('handleDragEnd: Card drag ended.');
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

async function handleDrop(event) {
    event.preventDefault();
    const droppedOnColumn = event.currentTarget;
    droppedOnColumn.classList.remove('drag-over');
    console.log('handleDrop: Card dropped on column:', droppedOnColumn.dataset.category);

    if (draggedCardElement) {
        const cardId = event.dataTransfer.getData('text/plain');
        const oldCategory = draggedCardElement.dataset.category;
        const newCategory = droppedOnColumn.dataset.category;

        if (oldCategory !== newCategory) {
            console.log(`handleDrop: Moving card ${cardId} from ${oldCategory} to ${newCategory}`);

            // Find the full card data from the local 'cards' array
            const cardToUpdate = cards.find(card => card._id === cardId);

            if (!cardToUpdate) {
                console.error(`handleDrop: Card with ID ${cardId} not found in local state.`);
                showAppStatusMessage(`Error: Could not find card to move. Please refresh.`, 'error');
                return;
            }

            // Create the data payload for the API call, ensuring all required fields are sent
            const updatePayload = {
                title: cardToUpdate.title,
                description: cardToUpdate.description,
                category: newCategory // This is the only field that changes
            };

            try {
                await apiCall(`/cards/${cardId}`, 'PUT', updatePayload); // Send the full payload
                showAppStatusMessage(`Card moved to ${newCategory}!`, 'success');
                fetchCategoriesAndCards();
                console.log('handleDrop: Card move successful.');
            } catch (error) {
                console.error('handleDrop: Error moving card:', error);
                showAppStatusMessage(`Error moving card: ${error.message}`, 'error');
            }
        } else {
            console.log('handleDrop: Card dropped in same category, no action needed.');
        }
    }
}

// --- Confirmation Modal Logic ---
function showConfirmation(message, onConfirmCallback) {
    console.log('showConfirmation: Displaying confirmation modal.');
    confirmationMessage.textContent = message;
    showModal(confirmationModal);
    currentConfirmationAction = onConfirmCallback;
}

function hideConfirmation() {
    console.log('hideConfirmation: Hiding confirmation modal.');
    hideModal(confirmationModal);
    currentConfirmationAction = null;
}

// --- NEW ADMIN PANEL LOGIC ---

function showAdminPanelModal() {
    console.log('showAdminPanelModal: Opening admin panel modal.');
    hideModal(settingsModal); // Hide settings modal when opening admin
    adminUserIdInput.value = ''; // Clear previous input
    adminManagedUser = null; // Clear managed user state
    showMessage(adminStep1Message, '', 'hidden', 0); // Clear message
    switchAdminPanelStep('step-1'); // Go to step 1 (ID input)
    showModal(adminPanelModal);
}

function switchAdminPanelStep(stepId) {
    console.log('switchAdminPanelStep: Switching admin panel to:', stepId);
    adminStep1.classList.add('hidden');
    adminStep2.classList.add('hidden');

    if (stepId === 'step-1') {
        adminStep1.classList.remove('hidden');
        adminStep1.classList.add('active-admin-step');
        adminStep2.classList.remove('active-admin-step');
    } else if (stepId === 'step-2') {
        adminStep2.classList.remove('hidden');
        adminStep2.classList.add('active-admin-step');
        adminStep1.classList.remove('active-admin-step');
    }
}

async function handleAdminEnterUserId() {
    console.log('handleAdminEnterUserId: Attempting to fetch user for admin panel.');
    showMessage(adminStep1Message, '', 'hidden', 0);
    const userId = adminUserIdInput.value.trim();

    if (!userId) {
        showMessage(adminStep1Message, 'Please enter a user ID.', 'error');
        return;
    }

    try {
        // Fetch user data using the new admin API endpoint
        const userData = await apiCall(`/admin/user/${userId}`, 'GET');
        adminManagedUser = userData;
        console.log('handleAdminEnterUserId: Fetched user for admin:', adminManagedUser);

        // Populate step 2 with user data
        adminManagedUsername.textContent = adminManagedUser.username;
        adminManagedUserId.textContent = adminManagedUser._id;
        adminManagedDiscordId.textContent = adminManagedUser.discordId || 'N/A';
        adminManagedDiscordUsername.textContent = adminManagedUser.discordUsername ? `${adminManagedUser.discordUsername}#${adminManagedUser.discordDiscriminator || 'XXXX'}` : 'N/A'; // Corrected discriminator access

        // Clear messages for admin step 2 forms
        showMessage(adminStep2Message, '', 'hidden', 0);
        showMessage(adminUsernameUpdateMessage, '', 'hidden', 0);
        showMessage(adminPasswordResetMessage, '', 'hidden', 0);
        showMessage(adminCategoriesMessage, '', 'hidden', 0);
        showMessage(adminTasksMessage, '', 'hidden', 0);

        // Populate update username field
        adminNewUsernameInput.value = adminManagedUser.username;
        adminNewPasswordInput.value = ''; // Clear password field

        // Load categories and cards for the managed user
        await loadAdminManagedUserCategories();
        await loadAdminManagedUserCards();

        switchAdminPanelStep('step-2');
    } catch (error) {
        console.error('handleAdminEnterUserId: Error fetching user:', error);
        showMessage(adminStep1Message, error.message, 'error');
    }
}

async function handleAdminUpdateUsername(event) {
    event.preventDefault();
    if (!adminManagedUser) return;
    console.log('handleAdminUpdateUsername: Updating username for managed user:', adminManagedUser._id);
    showMessage(adminUsernameUpdateMessage, '', 'hidden', 0);

    const newUsername = adminNewUsernameInput.value.trim();
    if (!newUsername) {
        showMessage(adminUsernameUpdateMessage, 'New username cannot be empty.', 'error');
        return;
    }
    if (newUsername === adminManagedUser.username) {
        showMessage(adminUsernameUpdateMessage, 'Username is already up to date.', 'success');
        return;
    }

    try {
        const data = await apiCall(`/admin/user/${adminManagedUser._id}/username`, 'PUT', { username: newUsername });
        adminManagedUser.username = data.user.username; // Update local state
        adminManagedUsername.textContent = data.user.username; // Update display
        showMessage(adminUsernameUpdateMessage, 'Username updated successfully!', 'success');
        console.log('handleAdminUpdateUsername: Username updated for managed user.');
    } catch (error) {
        console.error('handleAdminUpdateUsername: Error updating username for managed user:', error);
        showMessage(adminUsernameUpdateMessage, error.message, 'error');
    }
}

async function handleAdminResetPassword(event) {
    event.preventDefault();
    if (!adminManagedUser) return;
    console.log('handleAdminResetPassword: Resetting password for managed user:', adminManagedUser._id);
    showMessage(adminPasswordResetMessage, '', 'hidden', 0);

    const newPassword = adminNewPasswordInput.value.trim();
    if (!newPassword) {
        showMessage(adminPasswordResetMessage, 'New password cannot be empty.', 'error');
        return;
    }

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/password`, 'PUT', { newPassword });
        showMessage(adminPasswordResetMessage, 'Password reset successfully!', 'success');
        adminNewPasswordInput.value = ''; // Clear password field
        console.log('handleAdminResetPassword: Password reset for managed user.');
    } catch (error) {
        console.error('handleAdminResetPassword: Error resetting password for managed user:', error);
        showMessage(adminPasswordResetMessage, error.message, 'error');
    }
}

async function loadAdminManagedUserCategories() {
    if (!adminManagedUser) return;
    console.log('loadAdminManagedUserCategories: Fetching categories for managed user:', adminManagedUser._id);
    try {
        const userCategories = await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET');
        adminCategoriesList.innerHTML = ''; // Clear previous list
        if (userCategories.length === 0) {
            adminCategoriesList.innerHTML = '<p class="text-gray-400 text-sm">No categories for this user.</p>';
        } else {
            userCategories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'flex justify-between items-center bg-gray-700 p-2 rounded-md mb-2';
                categoryDiv.innerHTML = `
                    <span class="text-white">${category.name}</span>
                    <button class="text-red-400 hover:text-red-600 transition-colors ml-2 delete-admin-category-btn" data-category-id="${category._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                `;
                adminCategoriesList.appendChild(categoryDiv);
            });
            // Attach event listeners after rendering
            document.querySelectorAll('.delete-admin-category-btn').forEach(button => {
                button.onclick = () => showConfirmation('Are you sure you want to delete this category and its tasks for this user?', () => handleDeleteAdminCategory(button.dataset.categoryId));
            });
        }
        showMessage(adminCategoriesMessage, '', 'hidden', 0); // Clear message
    } catch (error) {
        console.error('loadAdminManagedUserCategories: Error fetching categories:', error);
        showMessage(adminCategoriesMessage, `Error loading categories: ${error.message}`, 'error');
    }
}

async function handleAdminAddCategory(event) {
    event.preventDefault();
    if (!adminManagedUser) return;
    console.log('handleAdminAddCategory: Adding category for managed user:', adminManagedUser._id);
    showMessage(adminCategoriesMessage, '', 'hidden', 0);

    const categoryName = adminAddCategoryInput.value.trim();
    if (!categoryName) {
        showMessage(adminCategoriesMessage, 'Category name cannot be empty.', 'error');
        return;
    }

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'POST', { name: categoryName });
        showMessage(adminCategoriesMessage, 'Category added successfully!', 'success');
        adminAddCategoryInput.value = '';
        await loadAdminManagedUserCategories(); // Refresh list
        await loadAdminManagedUserCards(); // Also refresh cards as a category was added
    } catch (error) {
        console.error('handleAdminAddCategory: Error adding category:', error);
        showMessage(adminCategoriesMessage, error.message, 'error');
    }
}

async function handleDeleteAdminCategory(categoryId) {
    if (!adminManagedUser) return;
    console.log('handleDeleteAdminCategory: Deleting category for managed user:', adminManagedUser._id, 'category ID:', categoryId);
    showMessage(adminCategoriesMessage, '', 'hidden', 0);

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/categories/${categoryId}`, 'DELETE');
        showMessage(adminCategoriesMessage, 'Category deleted successfully!', 'success');
        await loadAdminManagedUserCategories(); // Refresh list
        await loadAdminManagedUserCards(); // Also refresh cards as a category was deleted
    } catch (error) {
        console.error('handleDeleteAdminCategory: Error deleting category:', error);
        showMessage(adminCategoriesMessage, error.message, 'error');
    }
}

async function loadAdminManagedUserCards() {
    if (!adminManagedUser) return;
    console.log('loadAdminManagedUserCards: Fetching cards for managed user:', adminManagedUser._id);
    try {
        const userCards = await apiCall(`/admin/user/${adminManagedUser._id}/cards`, 'GET');
        adminTasksList.innerHTML = ''; // Clear previous list
        if (userCards.length === 0) {
            adminTasksList.innerHTML = '<p class="text-gray-400 text-sm">No tasks for this user.</p>';
        } else {
            userCards.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'flex justify-between items-center bg-gray-700 p-2 rounded-md mb-2';
                cardDiv.innerHTML = `
                    <span class="text-white text-sm font-semibold">${card.title}</span>
                    <span class="text-gray-300 text-xs italic ml-2">(${card.category})</span>
                    <div class="flex items-center ml-auto">
                        <button class="text-blue-400 hover:text-blue-600 transition-colors edit-admin-task-btn mr-1" data-card-id="${card._id}" data-card-title="${card.title}" data-card-description="${card.description}" data-card-category="${card.category}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="text-red-400 hover:text-red-600 transition-colors delete-admin-task-btn" data-card-id="${card._id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    </div>
                `;
                adminTasksList.appendChild(cardDiv);
            });

            // Populate category select for adding new tasks for managed user
            adminAddTaskCategorySelect.innerHTML = '';
            const managedUserCategories = await apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET');
            if (managedUserCategories.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No categories for this user';
                option.disabled = true;
                option.selected = true;
                adminAddTaskCategorySelect.appendChild(option);
            } else {
                managedUserCategories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.name;
                    option.textContent = cat.name;
                    adminAddTaskCategorySelect.appendChild(option);
                });
                adminAddTaskCategorySelect.value = managedUserCategories[0].name; // Select first by default
            }


            // Attach event listeners after rendering
            document.querySelectorAll('.edit-admin-task-btn').forEach(button => {
                button.onclick = () => openAdminEditCardModal({
                    _id: button.dataset.cardId,
                    title: button.dataset.cardTitle,
                    description: button.dataset.cardDescription,
                    category: button.dataset.cardCategory
                });
            });
            document.querySelectorAll('.delete-admin-task-btn').forEach(button => {
                button.onclick = () => showConfirmation('Are you sure you want to delete this task for this user?', () => handleDeleteAdminCard(button.dataset.cardId));
            });
        }
        showMessage(adminTasksMessage, '', 'hidden', 0);
    }
     catch (error) {
        console.error('loadAdminManagedUserCards: Error fetching cards:', error);
        showMessage(adminTasksMessage, `Error loading tasks: ${error.message}`, 'error');
    }
}

async function handleAdminAddTask(event) {
    event.preventDefault();
    if (!adminManagedUser) return;
    console.log('handleAdminAddTask: Adding task for managed user:', adminManagedUser._id);
    showMessage(adminTasksMessage, '', 'hidden', 0);

    const title = adminAddTaskTitleInput.value.trim();
    const description = adminAddTaskDescInput.value.trim();
    const category = adminAddTaskCategorySelect.value;

    if (!title || !description || !category) {
        showMessage(adminTasksMessage, 'All fields are required.', 'error');
        return;
    }

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/cards`, 'POST', { title, description, category });
        showMessage(adminTasksMessage, 'Task added successfully!', 'success');
        adminAddTaskTitleInput.value = '';
        adminAddTaskDescInput.value = '';
        await loadAdminManagedUserCards(); // Refresh list
    } catch (error) {
        console.error('handleAdminAddTask: Error adding task:', error);
        showMessage(adminTasksMessage, error.message, 'error');
    }
}

// Re-using addEditCardModal for admin purposes, but changing its behavior
function openAdminEditCardModal(cardToEdit) {
    console.log('openAdminEditCardModal: Opening card modal for admin edit. Card:', cardToEdit._id);
    hideModal(adminPanelModal); // Temporarily hide admin panel
    editingCardData = cardToEdit; // Set the card to be edited
    cardForm.reset();

    cardModalTitle.textContent = 'Admin Edit Task';
    cardTitleInput.value = cardToEdit.title;
    cardDescriptionInput.value = cardToEdit.description;
    cardCategorySelect.value = cardToEdit.category;
    cardSubmitBtn.textContent = 'Admin Save Changes';

    // Populate category select with categories of the *managed user*
    cardCategorySelect.innerHTML = '';
    apiCall(`/admin/user/${adminManagedUser._id}/categories`, 'GET')
        .then(managedUserCategories => {
            if (managedUserCategories.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No categories for this user';
                option.disabled = true;
                option.selected = true;
                cardCategorySelect.appendChild(option);
            } else {
                managedUserCategories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.name;
                    option.textContent = cat.name;
                    cardCategorySelect.appendChild(option);
                });
                cardCategorySelect.value = cardToEdit.category; // Select current category
            }
        })
        .catch(error => {
            console.error('openAdminEditCardModal: Error loading managed user categories:', error);
            showMessage(cardFormMessage, `Error loading categories for editing: ${error.message}`, 'error');
        });

    // Temporarily override handleCardFormSubmit for admin save action
    cardForm.removeEventListener('submit', handleCardFormSubmit);
    cardForm.addEventListener('submit', handleAdminEditCardSubmit, { once: true }); // Use once to remove after first submit

    showMessage(cardFormMessage, '', 'hidden', 0);
    showModal(addEditCardModal);
}

// New submit handler specifically for admin editing a card
async function handleAdminEditCardSubmit(event) {
    event.preventDefault();
    if (!adminManagedUser || !editingCardData) return;
    console.log('handleAdminEditCardSubmit: Admin saving changes for task:', editingCardData._id);
    showMessage(cardFormMessage, '', 'hidden', 0);

    const title = cardTitleInput.value.trim();
    const description = cardDescriptionInput.value.trim();
    const category = cardCategorySelect.value;

    if (!title || !description || !category) {
        showMessage(cardFormMessage, 'All fields are required.', 'error');
        return;
    }

    const cardData = { title, description, category };

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/cards/${editingCardData._id}`, 'PUT', cardData);
        showMessage(cardFormMessage, 'Task updated successfully by admin!', 'success');
        cardForm.reset();
        hideModal(addEditCardModal);
        await loadAdminManagedUserCards(); // Refresh the admin view's task list
        showModal(adminPanelModal); // Show admin panel again
        console.log('handleAdminEditCardSubmit: Task updated by admin.');
    } catch (error) {
        console.error('handleAdminEditCardSubmit: Error updating task by admin:', error);
        showMessage(cardFormMessage, error.message, 'error');
    } finally {
        // Re-attach the regular handleCardFormSubmit for other uses of the modal
        cardForm.removeEventListener('submit', handleAdminEditCardSubmit);
        cardForm.addEventListener('submit', handleCardFormSubmit);
    }
}


async function handleDeleteAdminCard(cardId) {
    if (!adminManagedUser) return;
    console.log('handleDeleteAdminCard: Deleting card for managed user:', adminManagedUser._id, 'card ID:', cardId);
    showMessage(adminTasksMessage, '', 'hidden', 0);

    try {
        await apiCall(`/admin/user/${adminManagedUser._id}/cards/${cardId}`, 'DELETE');
        showMessage(adminTasksMessage, 'Task deleted successfully!', 'success');
        await loadAdminManagedUserCards(); // Refresh list
    } catch (error) {
        console.error('handleDeleteAdminCard: Error deleting task:', error);
        showMessage(adminTasksMessage, error.message, 'error');
    }
}

async function handleAdminDeleteUser() {
    if (!adminManagedUser) return;
    console.log('handleAdminDeleteUser: Deleting managed user:', adminManagedUser._id);
    showMessage(adminStep2Message, '', 'hidden', 0);

    showConfirmation(`Are you ABSOLUTELY sure you want to delete user "${adminManagedUser.username}" (${adminManagedUser._id})? This action is irreversible and will delete ALL their data!`, async () => {
        try {
            await apiCall(`/admin/user/${adminManagedUser._id}`, 'DELETE');
            showAppStatusMessage(`User "${adminManagedUser.username}" and all their data deleted successfully!`, 'success');
            hideModal(adminPanelModal);
            adminUserIdInput.value = ''; // Clear input for next admin session
            adminManagedUser = null; // Clear state
            console.log('handleAdminDeleteUser: User deleted by admin.');
        } catch (error) {
            console.error('handleAdminDeleteUser: Error deleting user:', error);
            showMessage(adminStep2Message, error.message, 'error');
        }
    });
}

// --- Event Listeners (Initialized on DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initializing event listeners.');
    // Auth View Listeners
    authForm.addEventListener('submit', handleAuthSubmit);
    authToggleLink.addEventListener('click', () => {
        setAppView(currentAuthViewType === 'login' ? 'register' : 'login');
    });

    // Board View Listeners
    logoutBtn.addEventListener('click', logoutUser);
    settingsLogoutBtn.addEventListener('click', logoutUser);
    settingsBtn.addEventListener('click', renderSettingsModal);
    addCategoryBtn.addEventListener('click', () => {
        showModal(addCategoryModal);
        showMessage(addCategoryMessage, '', 'hidden', 0);
        newCategoryNameInput.value = '';
    });
    addCardBtn.addEventListener('click', () => openAddEditCardModal());

    // Modals Close Buttons (unified handler)
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modal;
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                hideModal(modalElement);
                console.log('Modal closed by close button:', modalId);
                // If closing admin modal, reset to step 1
                if (modalId === 'admin-panel-modal') {
                    switchAdminPanelStep('step-1');
                    adminUserIdInput.value = '';
                    adminManagedUser = null;
                }
                 // If closing add/edit card modal that was opened from admin panel, re-open admin panel
                if (modalId === 'add-edit-card-modal' && adminManagedUser) {
                    showModal(adminPanelModal);
                }
            }
        });
    });

    // Modals Click Outside (unified handler for main modals)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modal);
                console.log('Modal closed by clicking outside:', modal.id);
                // If closing admin modal, reset to step 1
                if (modal.id === 'admin-panel-modal') {
                    switchAdminPanelStep('step-1');
                    adminUserIdInput.value = '';
                    adminManagedUser = null;
                }
                 // If closing add/edit card modal that was opened from admin panel, re-open admin panel
                if (modal.id === 'add-edit-card-modal' && adminManagedUser) {
                    showModal(adminPanelModal);
                }
            }
        });
    });

    // Add Category Modal Listeners
    addCategoryForm.addEventListener('submit', handleAddCategoryFormSubmit);

    // Add/Edit Card Modal Listeners (default handler)
    cardForm.addEventListener('submit', handleCardFormSubmit);

    // Settings Modal Listeners
    updateUsernameForm.addEventListener('submit', handleUpdateUsername);
    updatePasswordForm.addEventListener('submit', handleUpdatePassword);
    connectDiscordBtn.addEventListener('click', handleConnectDiscord);

    // Settings Tab Button Listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tabId;
            switchSettingsTab(tabId);
        });
    });

    // Confirmation Modal Listeners
    confirmActionBtn.addEventListener('click', () => {
        if (currentConfirmationAction) {
            currentConfirmationAction();
            console.log('Confirmation action executed.');
        }
        hideConfirmation();
    });
    cancelActionBtn.addEventListener('click', hideConfirmation);

    // *** NEW ADMIN PANEL EVENT LISTENERS ***
    adminPanelBtn.addEventListener('click', showAdminPanelModal);
    adminNextBtn.addEventListener('click', handleAdminEnterUserId);
    adminBackToIdInputBtn.addEventListener('click', () => {
        switchAdminPanelStep('step-1');
        adminUserIdInput.value = ''; // Clear input for next attempt
        adminManagedUser = null; // Clear managed user data
        showMessage(adminStep1Message, '', 'hidden', 0);
    });

    adminUpdateUsernameForm.addEventListener('submit', handleAdminUpdateUsername);
    adminResetPasswordForm.addEventListener('submit', handleAdminResetPassword);
    adminDeleteUserBtn.addEventListener('click', handleAdminDeleteUser);

    adminAddCategoryForm.addEventListener('submit', handleAdminAddCategory);
    adminAddTaskForm.addEventListener('submit', handleAdminAddTask);

    // Initial check on load to determine which view to show
    checkAuthAndRender();

    // Listener for clicks anywhere on the document to hide the options menu
    document.addEventListener('click', (event) => {
        const target = event.target;
        const isClickInsideMenu = cardOptionsMenu.contains(target);
        // Do NOT use activeCardOptionsMenuButton.contains(target) here for the root document listener,
        // as the initial click on the button is what opened the menu.
        // We already stopped propagation on the optionsButton click, so the initial click won't reach here.
        // This listener is for subsequent clicks *away* from the menu.
        if (cardOptionsMenu.classList.contains('show') && !isClickInsideMenu) {
            hideCardOptionsMenu();
        }
    });
    console.log('DOMContentLoaded: Initialization complete.');
});
