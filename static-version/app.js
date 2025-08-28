// Static Library Tracker - Client-side only version
// Uses localStorage and IndexedDB for data persistence

// Global state
let currentUser = null;
let libraries = [];
let librarySystems = [];
let counties = [];
let currentLibraryId = null;

// DOM elements
const elements = {
    // Search and filters
    searchInput: document.getElementById('searchInput'),
    countyFilter: document.getElementById('countyFilter'),
    librarySystemFilter: document.getElementById('librarySystemFilter'),
    addLibraryBtn: document.getElementById('addLibraryBtn'),
    
    // Stats
    totalLibraries: document.getElementById('totalLibraries'),
    totalImages: document.getElementById('totalImages'),
    totalVisits: document.getElementById('totalVisits'),
    totalUsers: document.getElementById('totalUsers'),
    
    // Libraries grid
    librariesGrid: document.getElementById('librariesGrid'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    
    // Modals
    addLibraryModal: document.getElementById('addLibraryModal'),
    libraryDetailModal: document.getElementById('libraryDetailModal'),
    uploadImageModal: document.getElementById('uploadImageModal'),
    addVisitModal: document.getElementById('addVisitModal'),
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    userProfileModal: document.getElementById('userProfileModal'),
    adminModal: document.getElementById('adminModal'),
    adminUsersModal: document.getElementById('adminUsersModal'),
    
    // Forms
    addLibraryForm: document.getElementById('addLibraryForm'),
    uploadImageForm: document.getElementById('uploadImageForm'),
    addVisitForm: document.getElementById('addVisitForm'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // Modal close buttons
    closeAddLibraryModal: document.getElementById('closeAddLibraryModal'),
    closeLibraryDetailModal: document.getElementById('closeLibraryDetailModal'),
    closeUploadImageModal: document.getElementById('closeUploadImageModal'),
    closeAddVisitModal: document.getElementById('closeAddVisitModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    closeRegisterModal: document.getElementById('closeRegisterModal'),
    closeUserProfileModal: document.getElementById('closeUserProfileModal'),
    closeAdminModal: document.getElementById('closeAdminModal'),
    closeAdminUsersModal: document.getElementById('closeAdminUsersModal'),
    
    // Cancel buttons
    cancelAddLibrary: document.getElementById('cancelAddLibrary'),
    cancelUploadImage: document.getElementById('cancelUploadImage'),
    cancelAddVisit: document.getElementById('cancelAddVisit'),
    cancelLogin: document.getElementById('cancelLogin'),
    cancelRegister: document.getElementById('cancelRegister'),
    
    // Library detail elements
    detailLibraryName: document.getElementById('detailLibraryName'),
    detailAddress: document.getElementById('detailAddress'),
    detailCity: document.getElementById('detailCity'),
    detailCounty: document.getElementById('detailCounty'),
    detailPhone: document.getElementById('detailPhone'),
    detailWebsite: document.getElementById('detailWebsite'),
    
    // Tab elements
    tabBtns: document.querySelectorAll('.tab-btn'),
    imagesTab: document.getElementById('imagesTab'),
    visitsTab: document.getElementById('visitsTab'),
    
    // Content areas
    imagesGrid: document.getElementById('imagesGrid'),
    visitsList: document.getElementById('visitsList'),
    
    // Action buttons
    uploadImageBtn: document.getElementById('uploadImageBtn'),
    addVisitBtn: document.getElementById('addVisitBtn'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    userProfileBtn: document.getElementById('userProfileBtn'),
    logoutBtn: document.getElementById('logoutBtn')
};

// Data storage using localStorage and IndexedDB
const storage = {
    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('LibraryTracker', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Libraries store
                if (!db.objectStoreNames.contains('libraries')) {
                    const libraryStore = db.createObjectStore('libraries', { keyPath: 'id', autoIncrement: true });
                    libraryStore.createIndex('name', 'name', { unique: false });
                    libraryStore.createIndex('county', 'county', { unique: false });
                    libraryStore.createIndex('library_system', 'library_system', { unique: false });
                }
                
                // Images store
                if (!db.objectStoreNames.contains('images')) {
                    const imageStore = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                    imageStore.createIndex('library_id', 'library_id', { unique: false });
                    imageStore.createIndex('user_id', 'user_id', { unique: false });
                }
                
                // Visits store
                if (!db.objectStoreNames.contains('visits')) {
                    const visitStore = db.createObjectStore('visits', { keyPath: 'id', autoIncrement: true });
                    visitStore.createIndex('library_id', 'library_id', { unique: false });
                    visitStore.createIndex('user_id', 'user_id', { unique: false });
                }
                
                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('email', 'email', { unique: true });
                }
                
                // Admin users store
                if (!db.objectStoreNames.contains('admin_users')) {
                    const adminStore = db.createObjectStore('admin_users', { keyPath: 'id', autoIncrement: true });
                    adminStore.createIndex('user_id', 'user_id', { unique: true });
                }
            };
        });
    },
    
    // Generic CRUD operations
    async add(storeName, data) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async getAll(storeName) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async get(storeName, id) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async update(storeName, data) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async delete(storeName, id) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    // Library-specific operations
    async getLibraries() {
        return await this.getAll('libraries');
    },
    
    async addLibrary(libraryData) {
        return await this.add('libraries', {
            ...libraryData,
            created_at: new Date().toISOString(),
            image_count: 0,
            visit_count: 0
        });
    },
    
    async getLibrary(id) {
        return await this.get('libraries', id);
    },
    
    // Image-specific operations
    async getImages(libraryId) {
        const images = await this.getAll('images');
        return images.filter(img => img.library_id === libraryId);
    },
    
    async addImage(imageData) {
        return await this.add('images', {
            ...imageData,
            created_at: new Date().toISOString()
        });
    },
    
    // Visit-specific operations
    async getVisits(libraryId) {
        const visits = await this.getAll('visits');
        return visits.filter(visit => visit.library_id === libraryId);
    },
    
    async addVisit(visitData) {
        return await this.add('visits', {
            ...visitData,
            created_at: new Date().toISOString()
        });
    },
    
    // User-specific operations
    async getUsers() {
        return await this.getAll('users');
    },
    
    async addUser(userData) {
        return await this.add('users', {
            ...userData,
            created_at: new Date().toISOString(),
            total_visits: 0,
            total_images: 0
        });
    },
    
    async getUserByUsername(username) {
        const users = await this.getAll('users');
        return users.find(user => user.username === username);
    },
    
    async updateUser(userData) {
        return await this.update('users', userData);
    }
};

// Utility functions
const utils = {
    showLoading() {
        elements.loadingIndicator.style.display = 'flex';
    },
    
    hideLoading() {
        elements.loadingIndicator.style.display = 'none';
    },
    
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Unknown date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Unknown date';
        }
    },
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    },
    
    // Simple hash function for passwords
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
};

// Modal management
const modalManager = {
    open(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    close(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    closeAll() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.close(modal);
        });
    }
};

// User management
const userManager = {
    init() {
        this.loadUserFromStorage();
        this.updateUI();
    },
    
    loadUserFromStorage() {
        const userData = localStorage.getItem('libraryTrackerUser');
        if (userData) {
            currentUser = JSON.parse(userData);
        }
    },
    
    saveUserToStorage() {
        if (currentUser) {
            localStorage.setItem('libraryTrackerUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('libraryTrackerUser');
        }
    },
    
    async register(userData) {
        try {
            // Check if username already exists
            const existingUser = await storage.getUserByUsername(userData.username);
            if (existingUser) {
                throw new Error('Username already exists');
            }
            
            // Hash password
            const hashedUserData = {
                ...userData,
                password_hash: utils.hashPassword(userData.password)
            };
            
            const userId = await storage.addUser(hashedUserData);
            utils.showNotification('Registration successful! Please log in.', 'success');
            modalManager.close(elements.registerModal);
            modalManager.open(elements.loginModal);
        } catch (error) {
            console.error('Registration error:', error);
            utils.showNotification(error.message || 'Registration failed', 'error');
        }
    },
    
    async login(credentials) {
        try {
            const user = await storage.getUserByUsername(credentials.username);
            if (!user || user.password_hash !== utils.hashPassword(credentials.password)) {
                throw new Error('Invalid credentials');
            }
            
            currentUser = user;
            this.saveUserToStorage();
            this.updateUI();
            modalManager.close(elements.loginModal);
            utils.showNotification('Login successful!', 'success');
        } catch (error) {
            console.error('Login error:', error);
            utils.showNotification(error.message || 'Login failed', 'error');
        }
    },
    
    logout() {
        currentUser = null;
        this.saveUserToStorage();
        this.updateUI();
        utils.showNotification('Logged out successfully', 'success');
    },
    
    updateUI() {
        if (currentUser) {
            elements.loginBtn.style.display = 'none';
            elements.registerBtn.style.display = 'none';
            elements.userProfileBtn.style.display = 'inline-block';
            elements.logoutBtn.style.display = 'inline-block';
            elements.userProfileBtn.textContent = currentUser.display_name || currentUser.username;
        } else {
            elements.loginBtn.style.display = 'inline-block';
            elements.registerBtn.style.display = 'inline-block';
            elements.userProfileBtn.style.display = 'none';
            elements.logoutBtn.style.display = 'none';
        }
    },
    
    // Get anonymous user ID for tracking without account
    getAnonymousUserId() {
        let anonymousId = localStorage.getItem('anonymousUserId');
        if (!anonymousId) {
            anonymousId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('anonymousUserId', anonymousId);
        }
        return anonymousId;
    },
    
    // Get current user ID (logged in or anonymous)
    getCurrentUserId() {
        return currentUser ? currentUser.id : this.getAnonymousUserId();
    },
    
    // Get current username (logged in or anonymous)
    getCurrentUsername() {
        return currentUser ? currentUser.username : 'Anonymous User';
    },
    
    // Check if user is logged in
    isLoggedIn() {
        return !!currentUser;
    }
};

// Library management
const libraryManager = {
    async loadLibraries() {
        try {
            utils.showLoading();
            libraries = await storage.getLibraries();
            this.renderLibraries(libraries);
            this.updateStats();
        } catch (error) {
            console.error('Error loading libraries:', error);
            utils.showNotification('Error loading libraries', 'error');
        } finally {
            utils.hideLoading();
        }
    },
    
    renderLibraries(librariesToRender) {
        if (librariesToRender.length === 0) {
            elements.librariesGrid.innerHTML = '<p class="no-libraries">No libraries found. Add the first one!</p>';
            return;
        }
        
        elements.librariesGrid.innerHTML = librariesToRender.map(library => `
            <div class="library-card">
                <div class="library-info">
                    <div class="library-header">
                        <h3>${library.name}</h3>
                        ${library.library_system ? `<span class="library-system">${library.library_system}</span>` : ''}
                    </div>
                    <p><strong>${library.city}, ${library.county}</strong></p>
                    ${library.address ? `<p>${library.address}</p>` : ''}
                    <div class="library-stats">
                        <span class="stat">📸 ${library.image_count || 0} images</span>
                        <span class="stat">👥 ${library.visit_count || 0} visits</span>
                    </div>
                </div>
                <div class="library-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); libraryManager.openLibraryDetail(${library.id})">
                        📖 Details
                    </button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); libraryManager.addVisit(${library.id})">
                        ✅ Record Visit
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    async openLibraryDetail(libraryId) {
        try {
            const library = await storage.getLibrary(libraryId);
            if (!library) {
                utils.showNotification('Library not found', 'error');
                return;
            }
            
            currentLibraryId = libraryId;
            this.renderLibraryDetail(library);
            modalManager.open(elements.libraryDetailModal);
            
            // Load images and visits
            await this.loadLibraryImages(libraryId);
            await this.loadLibraryVisits(libraryId);
        } catch (error) {
            console.error('Error opening library detail:', error);
            utils.showNotification('Error loading library details', 'error');
        }
    },
    
    renderLibraryDetail(library) {
        elements.detailLibraryName.textContent = library.name;
        elements.detailAddress.textContent = library.address || 'N/A';
        elements.detailCity.textContent = library.city || 'N/A';
        elements.detailCounty.textContent = library.county || 'N/A';
        elements.detailPhone.textContent = library.phone || 'N/A';
        
        const websiteLink = elements.detailWebsite;
        if (library.website) {
            websiteLink.href = library.website;
            websiteLink.textContent = library.website;
            websiteLink.style.display = 'inline';
        } else {
            websiteLink.style.display = 'none';
        }
    },
    
    async loadLibraryImages(libraryId) {
        try {
            const images = await storage.getImages(libraryId);
            this.renderImages(images);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    },
    
    renderImages(images) {
        if (images.length === 0) {
            elements.imagesGrid.innerHTML = '<p>No images uploaded yet.</p>';
            return;
        }
        
        elements.imagesGrid.innerHTML = images.map(image => `
            <div class="image-card">
                <img src="${image.data_url}" alt="${image.caption || 'Library image'}" loading="lazy">
                <div class="image-info">
                    <p>${image.caption || 'No caption'}</p>
                    <small>Uploaded: ${utils.formatDate(image.created_at)}</small>
                </div>
            </div>
        `).join('');
    },
    
    async loadLibraryVisits(libraryId) {
        try {
            console.log('Loading visits for library:', libraryId);
            const visits = await storage.getVisits(libraryId);
            console.log('Found visits:', visits);
            this.renderVisits(visits);
        } catch (error) {
            console.error('Error loading visits:', error);
        }
    },
    
    renderVisits(visits) {
        console.log('Rendering visits:', visits);
        if (visits.length === 0) {
            elements.visitsList.innerHTML = '<p>No visits recorded yet.</p>';
            return;
        }
        
        elements.visitsList.innerHTML = visits.map(visit => `
            <div class="visit-item">
                <div class="visit-header">
                    <strong>${visit.visitor_name || 'Anonymous'}</strong>
                    <span class="visit-date">${utils.formatDate(visit.created_at)}</span>
                </div>
                ${visit.rating ? `<div class="visit-rating">${'⭐'.repeat(visit.rating)}</div>` : ''}
                ${visit.notes ? `<p class="visit-notes">${visit.notes}</p>` : ''}
            </div>
        `).join('');
    },
    
    addVisit(libraryId) {
        currentLibraryId = libraryId;
        modalManager.open(elements.addVisitModal);
    },
    
    updateStats() {
        elements.totalLibraries.textContent = libraries.length;
        // Calculate other stats from data
        this.calculateStats();
    },
    
    async calculateStats() {
        try {
            const images = await storage.getAll('images');
            const visits = await storage.getAll('visits');
            const users = await storage.getAll('users');
            
            elements.totalImages.textContent = images.length;
            elements.totalVisits.textContent = visits.length;
            elements.totalUsers.textContent = users.length;
        } catch (error) {
            console.error('Error calculating stats:', error);
        }
    }
};

// Form handlers
const formHandlers = {
    async handleAddLibrary(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const libraryData = Object.fromEntries(formData.entries());
        libraryData.submitted_by = currentUser?.id || null;
        
        try {
            await storage.addLibrary(libraryData);
            modalManager.close(elements.addLibraryModal);
            event.target.reset();
            
            if (currentUser) {
                utils.showNotification('Library added successfully!');
            } else {
                utils.showNotification('Library added successfully!');
            }
            
            await libraryManager.loadLibraries();
        } catch (error) {
            console.error('Error adding library:', error);
            utils.showNotification('Error adding library', 'error');
        }
    },
    
    async handleUploadImage(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const file = formData.get('image');
        const caption = formData.get('caption');
        
        try {
            // Convert image to data URL
            const dataUrl = await this.fileToDataUrl(file);
            
            const imageData = {
                library_id: currentLibraryId,
                user_id: userManager.getCurrentUserId(),
                username: userManager.getCurrentUsername(),
                caption: caption,
                data_url: dataUrl,
                filename: file.name,
                created_at: new Date().toISOString()
            };
            
            await storage.addImage(imageData);
            modalManager.close(elements.uploadImageModal);
            event.target.reset();
            await libraryManager.loadLibraryImages(currentLibraryId);
            await libraryManager.loadLibraries(); // Refresh stats
            utils.showNotification('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            utils.showNotification('Error uploading image', 'error');
        }
    },
    
    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
    
    async handleAddVisit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const visitData = {
            library_id: currentLibraryId,
            user_id: userManager.getCurrentUserId(),
            username: userManager.getCurrentUsername(),
            visitor_name: formData.get('visitor_name') || userManager.getCurrentUsername(),
            notes: formData.get('notes'),
            rating: formData.get('rating') ? parseInt(formData.get('rating')) : null,
            created_at: new Date().toISOString()
        };
        
        try {
            console.log('Saving visit data:', visitData);
            await storage.addVisit(visitData);
            console.log('Visit saved successfully');
            modalManager.close(elements.addVisitModal);
            event.target.reset();
            await libraryManager.loadLibraryVisits(currentLibraryId);
            await libraryManager.loadLibraries(); // Refresh stats
            utils.showNotification('Visit recorded successfully!');
        } catch (error) {
            console.error('Error adding visit:', error);
            utils.showNotification('Error recording visit', 'error');
        }
    },
    
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        
        await userManager.login(credentials);
    },
    
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            display_name: formData.get('display_name')
        };
        
        await userManager.register(userData);
    }
};

// Search and filter functionality
const searchManager = {
    init() {
        elements.searchInput.addEventListener('input', () => this.searchLibraries());
        elements.countyFilter.addEventListener('change', () => this.searchLibraries());
        elements.librarySystemFilter.addEventListener('change', () => this.searchLibraries());
    },
    
    searchLibraries() {
        const query = elements.searchInput.value.toLowerCase();
        const county = elements.countyFilter.value;
        const librarySystem = elements.librarySystemFilter.value;
        
        const filteredLibraries = libraries.filter(library => {
            const matchesQuery = !query || 
                library.name.toLowerCase().includes(query) ||
                library.city.toLowerCase().includes(query) ||
                library.county.toLowerCase().includes(query);
            
            const matchesCounty = !county || library.county === county;
            const matchesSystem = !librarySystem || library.library_system === librarySystem;
            
            return matchesQuery && matchesCounty && matchesSystem;
        });
        
        libraryManager.renderLibraries(filteredLibraries);
    },
    
    async loadFilters() {
        // Extract unique counties and library systems
        const uniqueCounties = [...new Set(libraries.map(lib => lib.county).filter(Boolean))].sort();
        const uniqueSystems = [...new Set(libraries.map(lib => lib.library_system).filter(Boolean))].sort();
        
        // Populate county filter
        elements.countyFilter.innerHTML = '<option value="">All Counties</option>' +
            uniqueCounties.map(county => `<option value="${county}">${county}</option>`).join('');
        
        // Populate library system filter
        elements.librarySystemFilter.innerHTML = '<option value="">All Library Systems</option>' +
            uniqueSystems.map(system => `<option value="${system}">${system}</option>`).join('');
    }
};

// Tab management
const tabManager = {
    init() {
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },
    
    switchTab(tabName) {
        // Update active tab button
        elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }
};

// Event listeners
function initEventListeners() {
    // Initialize view buttons (Grid/List)
    initViewButtons();
    
    // Modal close buttons
    elements.closeAddLibraryModal.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.closeLibraryDetailModal.addEventListener('click', () => modalManager.close(elements.libraryDetailModal));
    elements.closeUploadImageModal.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.closeAddVisitModal.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    elements.closeLoginModal.addEventListener('click', () => modalManager.close(elements.loginModal));
    elements.closeRegisterModal.addEventListener('click', () => modalManager.close(elements.registerModal));
    elements.closeUserProfileModal.addEventListener('click', () => modalManager.close(elements.userProfileModal));
    elements.closeAdminModal.addEventListener('click', () => modalManager.close(elements.adminModal));
    elements.closeAdminUsersModal.addEventListener('click', () => modalManager.close(elements.adminUsersModal));
    
    // Cancel buttons
    elements.cancelAddLibrary.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.cancelUploadImage.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.cancelAddVisit.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    elements.cancelLogin.addEventListener('click', () => modalManager.close(elements.loginModal));
    elements.cancelRegister.addEventListener('click', () => modalManager.close(elements.registerModal));
    
    // Forms
    elements.addLibraryForm.addEventListener('submit', formHandlers.handleAddLibrary);
    elements.uploadImageForm.addEventListener('submit', formHandlers.handleUploadImage);
    elements.addVisitForm.addEventListener('submit', formHandlers.handleAddVisit);
    elements.loginForm.addEventListener('submit', formHandlers.handleLogin);
    elements.registerForm.addEventListener('submit', formHandlers.handleRegister);
    
    // Action buttons
    elements.addLibraryBtn.addEventListener('click', () => modalManager.open(elements.addLibraryModal));
    elements.uploadImageBtn.addEventListener('click', () => modalManager.open(elements.uploadImageModal));
    elements.addVisitBtn.addEventListener('click', () => modalManager.open(elements.addVisitModal));
    elements.loginBtn.addEventListener('click', () => modalManager.open(elements.loginModal));
    elements.registerBtn.addEventListener('click', () => modalManager.open(elements.registerModal));
    elements.userProfileBtn.addEventListener('click', () => modalManager.open(elements.userProfileModal));
    elements.logoutBtn.addEventListener('click', () => userManager.logout());
    
    // Sync functionality
    const syncBtn = document.getElementById('syncBtn');
    const closeSyncModal = document.getElementById('closeSyncModal');
    const downloadBackupBtn = document.getElementById('downloadBackupBtn');
    const uploadBackupBtn = document.getElementById('uploadBackupBtn');
    const backupFileInput = document.getElementById('backupFileInput');
    const syncToCloudBtn = document.getElementById('syncToCloudBtn');
    const restoreFromCloudBtn = document.getElementById('restoreFromCloudBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const showDataBtn = document.getElementById('showDataBtn');
    const clearAllDataBtn = document.getElementById('clearAllDataBtn');
    
    if (syncBtn) syncBtn.addEventListener('click', () => {
        modalManager.open(document.getElementById('syncModal'));
        updateSyncStatus();
    });
    if (closeSyncModal) closeSyncModal.addEventListener('click', () => modalManager.close(document.getElementById('syncModal')));
    if (downloadBackupBtn) downloadBackupBtn.addEventListener('click', () => cloudSync.downloadBackup());
    if (uploadBackupBtn) uploadBackupBtn.addEventListener('click', () => backupFileInput.click());
    if (backupFileInput) backupFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            cloudSync.uploadBackup(e.target.files[0]);
        }
    });
    if (syncToCloudBtn) syncToCloudBtn.addEventListener('click', async () => {
        const result = await cloudSync.syncWithCloud();
        if (result.success) {
            utils.showNotification('Data synced to cloud successfully!', 'success');
            updateSyncStatus();
        } else {
            utils.showNotification('Failed to sync: ' + result.error, 'error');
        }
    });
    if (restoreFromCloudBtn) restoreFromCloudBtn.addEventListener('click', async () => {
        const result = await cloudSync.restoreFromCloud();
        if (result.success) {
            utils.showNotification('Data restored from cloud successfully!', 'success');
            setTimeout(() => window.location.reload(), 2000);
        } else {
            utils.showNotification('Failed to restore: ' + result.error, 'error');
        }
    });
    if (exportDataBtn) exportDataBtn.addEventListener('click', async () => {
        const result = await cloudSync.exportUserData();
        if (result.success) {
            const dataStr = JSON.stringify(result.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            utils.showNotification('Data exported successfully!', 'success');
        } else {
            utils.showNotification('Failed to export data: ' + result.error, 'error');
        }
    });
    if (showDataBtn) showDataBtn.addEventListener('click', async () => {
        const result = await cloudSync.exportUserData();
        if (result.success) {
            const dataStr = JSON.stringify(result.data, null, 2);
            alert('Your data:\n\n' + dataStr.substring(0, 1000) + (dataStr.length > 1000 ? '\n\n... (truncated)' : ''));
        } else {
            utils.showNotification('Failed to get data: ' + result.error, 'error');
        }
    });
    if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', async () => {
        if (confirm('⚠️ WARNING: This will permanently delete ALL your data including libraries, visits, images, and user accounts. This action cannot be undone. Are you sure you want to continue?')) {
            await storage.clearAllData();
            localStorage.clear();
            utils.showNotification('All data cleared. Page will reload...', 'warning');
            setTimeout(() => window.location.reload(), 2000);
        }
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modalManager.close(modal);
            }
        });
    });
    
    // Initialize view buttons (Grid/List)
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const librariesGrid = document.getElementById('librariesGrid');
    
    console.log('Initializing view buttons...');
    console.log('Found view buttons:', viewButtons.length);
    console.log('Found libraries grid:', librariesGrid);
    
    if (viewButtons.length === 0) {
        console.warn('No view buttons found!');
        return;
    }
    
    if (!librariesGrid) {
        console.warn('Libraries grid element not found!');
        return;
    }
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('View button clicked:', button.getAttribute('data-view'));
            
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const view = button.getAttribute('data-view');
            if (view === 'grid') {
                librariesGrid.className = 'libraries-grid';
                console.log('Switched to grid view');
                utils.showNotification('Switched to Grid View', 'info', 2000);
            } else if (view === 'list') {
                librariesGrid.className = 'libraries-list';
                console.log('Switched to list view');
                utils.showNotification('Switched to List View', 'info', 2000);
            }
        });
    });
    
    console.log('View buttons initialized successfully');
}

// Initialize tabs
tabManager.init();
}

    // Initialize app
    async function initApp() {
        try {
            // Initialize storage
            await storage.initDB();
            
            // Load preset libraries if database is empty
            await loadPresetLibraries();
            
            // Initialize user management (optional)
            userManager.init();
            
            // Load libraries
            await libraryManager.loadLibraries();
            
            // Initialize search and filters
            searchManager.init();
            await searchManager.loadFilters();
            
            // Initialize event listeners
            initEventListeners();
            
            // Show welcome message for new users
            showWelcomeMessage();
            
            console.log('Static Library Tracker initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            utils.showNotification('Error initializing app', 'error');
        }
    }

// Show welcome message for new users
function showWelcomeMessage() {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
        setTimeout(() => {
            utils.showNotification(
                'Welcome to California Library Tracker! 📚 You can start tracking libraries immediately. Create an account to sync data across devices.',
                'info',
                8000
            );
            localStorage.setItem('hasSeenWelcome', 'true');
        }, 2000);
    }
}

// Update sync status display
function updateSyncStatus() {
    const syncStatusElement = document.getElementById('syncStatus');
    if (!syncStatusElement) return;
    
    try {
        const status = cloudSync.getSyncStatus();
        const formatDate = (dateStr) => {
            if (!dateStr) return 'Never';
            return new Date(dateStr).toLocaleString();
        };
        
        const formatSize = (bytes) => {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        };
        
        syncStatusElement.innerHTML = `
            <div class="status-item">
                <span class="status-label">User ID:</span>
                <span class="status-value">${status.userId}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Last Sync:</span>
                <span class="status-value ${status.lastSync ? 'status-success' : 'status-warning'}">${formatDate(status.lastSync)}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Cloud Backup:</span>
                <span class="status-value ${status.hasCloudBackup ? 'status-success' : 'status-error'}">${status.hasCloudBackup ? 'Available' : 'Not Found'}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Local Data Size:</span>
                <span class="status-value">${formatSize(status.localDataSize)}</span>
            </div>
        `;
    } catch (error) {
        syncStatusElement.innerHTML = `
            <div class="status-item">
                <span class="status-label">Error:</span>
                <span class="status-value status-error">${error.message}</span>
            </div>
        `;
    }
}

// Load preset California libraries using the updater system
async function loadPresetLibraries() {
    try {
        console.log('Checking for library updates...');
        
        // Check for updates using the library updater system
        if (typeof libraryUpdater !== 'undefined') {
            const result = await libraryUpdater.checkForUpdates();
            console.log('Library update result:', result);
            
            if (result.success && result.totalAdded > 0) {
                utils.showNotification(result.message, 'success');
            }
        } else {
            console.log('Library updater not available, using fallback method...');
            
            // Fallback to old method if updater not available
            const existingLibraries = await storage.getLibraries();
            console.log('Existing libraries count:', existingLibraries.length);
            
            if (existingLibraries.length === 0 && typeof CALIFORNIA_LIBRARIES !== 'undefined') {
                console.log('Loading preset California libraries...');
                
                for (const library of CALIFORNIA_LIBRARIES) {
                    await storage.addLibrary(library);
                }
                
                console.log(`Loaded ${CALIFORNIA_LIBRARIES.length} preset libraries`);
                utils.showNotification(`Loaded ${CALIFORNIA_LIBRARIES.length} California libraries!`, 'success');
            } else {
                console.log('Skipping preset library load - database not empty or CALIFORNIA_LIBRARIES not available');
            }
        }
    } catch (error) {
        console.error('Error loading preset libraries:', error);
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: #48bb78;
    }
    
    .notification-error {
        background: #f56565;
    }
`;
document.head.appendChild(notificationStyles);

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    window.loadPresetLibraries = loadPresetLibraries;
    window.libraryManager = libraryManager;
    window.storage = storage;
    window.utils = utils;
    
    // Force reload preset libraries (for testing)
    window.forceLoadPresetLibraries = async function() {
        try {
            console.log('Force loading preset libraries...');
            const existingLibraries = await storage.getLibraries();
            console.log('Current libraries:', existingLibraries.length);
            
            // Clear existing libraries
            for (const library of existingLibraries) {
                await storage.delete('libraries', library.id);
            }
            
            // Load preset libraries
            await loadPresetLibraries();
            
            // Refresh display
            await libraryManager.loadLibraries();
            await searchManager.loadFilters();
            
            console.log('Force load complete!');
        } catch (error) {
            console.error('Error force loading:', error);
        }
    };
    
    // Test function for visits
    window.testVisitFunctionality = async () => {
        console.log('Testing visit functionality...');
        const libraries = await storage.getAll('libraries');
        if (libraries.length > 0) {
            const firstLibrary = libraries[0];
            console.log('Testing with library:', firstLibrary);
            await libraryManager.openLibraryDetail(firstLibrary.id);
        } else {
            console.log('No libraries found for testing');
        }
    };
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 