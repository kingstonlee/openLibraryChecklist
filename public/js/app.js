// Global variables
let currentLibraryId = null;
let currentUser = null;
let libraries = [];
let librarySystems = [];
let counties = [];

// DOM elements
const elements = {
    // Search and filters
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    countyFilter: document.getElementById('countyFilter'),
    librarySystemFilter: document.getElementById('librarySystemFilter'),
    addLibraryBtn: document.getElementById('addLibraryBtn'),
    
    // Stats
    totalLibraries: document.getElementById('totalLibraries'),
    totalImages: document.getElementById('totalImages'),
    totalVisits: document.getElementById('totalVisits'),
    
    // Libraries grid
    librariesGrid: document.getElementById('librariesGrid'),
    loading: document.getElementById('loading'),
    noResults: document.getElementById('noResults'),
    
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

// API functions
const api = {
    async getLibraries() {
        const response = await fetch('/api/libraries');
        return await response.json();
    },
    
    async getLibrarySystems() {
        const response = await fetch('/api/library-systems');
        return await response.json();
    },
    
    async getBranchesBySystem(systemName) {
        const response = await fetch(`/api/library-systems/${encodeURIComponent(systemName)}/branches`);
        return await response.json();
    },
    
    async searchLibraries(query, county, librarySystem) {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (county) params.append('county', county);
        if (librarySystem) params.append('library_system', librarySystem);
        
        const response = await fetch(`/api/search?${params}`);
        return await response.json();
    },
    
    async getLibrary(id) {
        const response = await fetch(`/api/libraries/${id}`);
        return await response.json();
    },
    
    async addLibrary(libraryData) {
        const response = await fetch('/api/libraries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(libraryData)
        });
        return await response.json();
    },
    
    async getImages(libraryId) {
        const response = await fetch(`/api/libraries/${libraryId}/images`);
        return await response.json();
    },
    
    async uploadImage(libraryId, formData) {
        const response = await fetch(`/api/libraries/${libraryId}/images`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    },
    
    async getVisits(libraryId) {
        const response = await fetch(`/api/libraries/${libraryId}/visits`);
        return await response.json();
    },
    
    async addVisit(libraryId, visitData) {
        const response = await fetch(`/api/libraries/${libraryId}/visits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitData)
        });
        return await response.json();
    },
    
    async getCounties() {
        const response = await fetch('/api/counties');
        return await response.json();
    },
    
    // User authentication
    async register(userData) {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },
    
    async login(credentials) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },
    
    async getUserProfile(userId) {
        const response = await fetch(`/api/users/${userId}`);
        return await response.json();
    },
    
    async getUserVisits(userId) {
        const response = await fetch(`/api/users/${userId}/visits`);
        return await response.json();
    },
    
    async getUserImages(userId) {
        const response = await fetch(`/api/users/${userId}/images`);
        return await response.json();
    },
    
    async getUserGoals(userId) {
        const response = await fetch(`/api/users/${userId}/goals`);
        return await response.json();
    },
    
    async getUserStats(userId) {
        const response = await fetch(`/api/users/${userId}/stats`);
        return await response.json();
    },
    
    async addLibraryGoal(userId, goalData) {
        const response = await fetch(`/api/users/${userId}/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goalData)
        });
        return await response.json();
    },
    
    async updateGoalStatus(userId, goalId, statusData) {
        const response = await fetch(`/api/users/${userId}/goals/${goalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusData)
        });
        return await response.json();
    },
    
    // Admin functions
    async getAdminStatus(userId) {
        const response = await fetch(`/api/users/${userId}/admin-status`);
        return await response.json();
    },
    
    async getPendingLibraries() {
        const response = await fetch('/api/admin/pending-libraries');
        return await response.json();
    },
    
    async approveLibrary(libraryId, adminData) {
        const response = await fetch(`/api/admin/pending-libraries/${libraryId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        return await response.json();
    },
    
    async rejectLibrary(libraryId, adminData) {
        const response = await fetch(`/api/admin/pending-libraries/${libraryId}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        return await response.json();
    },
    
    async getUserPendingLibraries(userId) {
        const response = await fetch(`/api/users/${userId}/pending-libraries`);
        return await response.json();
    },
    
    async toggleAdminMode(userId, action, role = 'admin') {
        const response = await fetch(`/api/users/${userId}/toggle-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, role })
        });
        return await response.json();
    },
    
    async getAllAdminUsers() {
        const response = await fetch('/api/admin/users');
        return await response.json();
    }
};

// Utility functions
const utils = {
    showLoading() {
        elements.loading.style.display = 'block';
        elements.librariesGrid.style.display = 'none';
        elements.noResults.style.display = 'none';
    },
    
    hideLoading() {
        elements.loading.style.display = 'none';
        elements.librariesGrid.style.display = 'grid';
    },
    
    showNoResults() {
        elements.noResults.style.display = 'block';
        elements.librariesGrid.style.display = 'none';
    },
    
    formatDate(dateString) {
        if (!dateString) {
            return 'Unknown date';
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Unknown date';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return 'Unknown date';
        }
    },
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
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
            const result = await api.register(userData);
            if (result.id) {
                utils.showNotification('Registration successful! Please log in.', 'success');
                modalManager.close(elements.registerModal);
                modalManager.open(elements.loginModal);
            }
        } catch (error) {
            console.error('Registration error:', error);
            utils.showNotification(error.message || 'Registration failed', 'error');
        }
    },
    
    async login(credentials) {
        try {
            const result = await api.login(credentials);
            if (result.user) {
                currentUser = result.user;
                this.saveUserToStorage();
                this.updateUI();
                modalManager.close(elements.loginModal);
                utils.showNotification('Login successful!', 'success');
                
                // Load user's data
                await this.loadUserData();
            }
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
            // Show user-specific elements
            if (elements.userProfileBtn) elements.userProfileBtn.style.display = 'inline-flex';
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'inline-flex';
            if (elements.loginBtn) elements.loginBtn.style.display = 'none';
            if (elements.registerBtn) elements.registerBtn.style.display = 'none';
            
            // Update user info
            if (elements.userProfileBtn) {
                elements.userProfileBtn.textContent = `👤 ${currentUser.display_name || currentUser.username}`;
            }
        } else {
            // Show login/register elements
            if (elements.userProfileBtn) elements.userProfileBtn.style.display = 'none';
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
            if (elements.loginBtn) elements.loginBtn.style.display = 'inline-flex';
            if (elements.registerBtn) elements.registerBtn.style.display = 'inline-flex';
        }
    },
    
    async loadUserData() {
        if (!currentUser) return;
        
        try {
            const [visits, images, goals, stats, adminStatus, pendingLibraries] = await Promise.all([
                api.getUserVisits(currentUser.id),
                api.getUserImages(currentUser.id),
                api.getUserGoals(currentUser.id),
                api.getUserStats(currentUser.id),
                api.getAdminStatus(currentUser.id),
                api.getUserPendingLibraries(currentUser.id)
            ]);
            
            // Store user data for use in the app
            currentUser.visits = visits;
            currentUser.images = images;
            currentUser.goals = goals;
            currentUser.stats = stats;
            currentUser.isAdmin = adminStatus.isAdmin;
            currentUser.adminRole = adminStatus.role;
            currentUser.pendingLibraries = pendingLibraries;
            
            this.saveUserToStorage();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },
    
    async openUserProfile() {
        if (!currentUser) return;
        
        try {
            await this.loadUserData();
            this.renderUserProfile();
            modalManager.open(elements.userProfileModal);
        } catch (error) {
            console.error('Error opening user profile:', error);
            utils.showNotification('Error loading profile', 'error');
        }
    },
    
    renderUserProfile() {
        if (!currentUser) return;
        
        const profileContent = document.getElementById('userProfileContent');
        if (!profileContent) return;
        
        profileContent.innerHTML = `
            <div class="user-profile-header">
                <h2>${currentUser.display_name || currentUser.username}</h2>
                <p class="user-email">${currentUser.email}</p>
                <p class="user-joined">Member since ${utils.formatDate(currentUser.created_at)}</p>
            </div>
            
            <div class="user-stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${currentUser.stats?.total_visits || 0}</div>
                    <div class="stat-label">Library Visits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${currentUser.stats?.total_images || 0}</div>
                    <div class="stat-label">Images Uploaded</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${currentUser.stats?.unique_libraries_visited || 0}</div>
                    <div class="stat-label">Libraries Visited</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${currentUser.stats?.counties_visited || 0}</div>
                    <div class="stat-label">Counties Explored</div>
                </div>
            </div>
            
            <div class="user-goals-section">
                <h3>Library Goals</h3>
                <div class="goals-summary">
                    <span>${currentUser.stats?.completed_goals || 0} completed</span>
                    <span>•</span>
                    <span>${currentUser.stats?.pending_goals || 0} pending</span>
                </div>
                <div class="goals-list">
                    ${this.renderGoalsList()}
                </div>
            </div>
            
            <div class="user-recent-activity">
                <h3>Recent Activity</h3>
                <div class="recent-visits">
                    ${this.renderRecentVisits()}
                </div>
            </div>
            
            ${currentUser.isAdmin ? `
            <div class="user-admin-section">
                <h3>Admin Panel</h3>
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="adminManager.openPendingLibraries()">
                        Review Pending Libraries (${pendingLibraries?.filter(p => p.status === 'pending').length || 0})
                    </button>
                    <button class="btn btn-secondary" onclick="adminManager.openAdminUsers()">
                        Manage Admin Users
                    </button>
                    <button class="btn btn-warning" onclick="adminManager.toggleAdminMode()">
                        🔓 Disable Admin Mode
                    </button>
                </div>
            </div>
            ` : `
            <div class="user-admin-section">
                <h3>Admin Access</h3>
                <div class="admin-actions">
                    <button class="btn btn-success" onclick="adminManager.toggleAdminMode()">
                        🔒 Enable Admin Mode
                    </button>
                </div>
            </div>
            `}
            
            ${currentUser.pendingLibraries && currentUser.pendingLibraries.length > 0 ? `
            <div class="user-pending-submissions">
                <h3>Your Pending Submissions</h3>
                <div class="pending-libraries-list">
                    ${this.renderPendingSubmissions()}
                </div>
            </div>
            ` : ''}
        `;
    },
    
    renderGoalsList() {
        if (!currentUser.goals || currentUser.goals.length === 0) {
            return '<p>No library goals set yet. Start exploring libraries!</p>';
        }
        
        return currentUser.goals.slice(0, 5).map(goal => `
            <div class="goal-item ${goal.status}">
                <div class="goal-info">
                    <div class="goal-library">${goal.library_name}</div>
                    <div class="goal-location">${goal.city}, ${goal.county}</div>
                </div>
                <div class="goal-status">
                    <span class="status-badge ${goal.status}">${goal.status}</span>
                </div>
            </div>
        `).join('');
    },
    
    renderRecentVisits() {
        if (!currentUser.visits || currentUser.visits.length === 0) {
            return '<p>No library visits recorded yet.</p>';
        }
        
        return currentUser.visits.slice(0, 5).map(visit => `
            <div class="recent-visit-item">
                <div class="visit-library">${visit.library_name}</div>
                <div class="visit-date">${utils.formatDate(visit.visit_date)}</div>
                ${visit.rating ? `<div class="visit-rating">⭐ ${visit.rating}/5</div>` : ''}
            </div>
        `).join('');
    },
    
    renderPendingSubmissions() {
        if (!currentUser.pendingLibraries || currentUser.pendingLibraries.length === 0) {
            return '<p>No pending submissions.</p>';
        }
        
        return currentUser.pendingLibraries.map(library => `
            <div class="pending-submission-item ${library.status}">
                <div class="submission-info">
                    <div class="submission-name">${library.name}</div>
                    <div class="submission-location">${library.city}, ${library.county}</div>
                    <div class="submission-date">Submitted: ${utils.formatDate(library.submitted_at)}</div>
                </div>
                <div class="submission-status">
                    <span class="status-badge ${library.status}">${library.status}</span>
                </div>
            </div>
        `).join('');
    }
};

// Admin management
const adminManager = {
    async openPendingLibraries() {
        if (!currentUser?.isAdmin) {
            utils.showNotification('Admin access required', 'error');
            return;
        }
        
        try {
            const pendingLibraries = await api.getPendingLibraries();
            this.renderPendingLibraries(pendingLibraries);
            modalManager.open(elements.adminModal);
        } catch (error) {
            console.error('Error loading pending libraries:', error);
            utils.showNotification('Error loading pending libraries', 'error');
        }
    },
    
    renderPendingLibraries(libraries) {
        const adminContent = document.getElementById('adminContent');
        if (!adminContent) return;
        
        if (libraries.length === 0) {
            adminContent.innerHTML = '<p>No pending libraries to review.</p>';
            return;
        }
        
        adminContent.innerHTML = `
            <div class="pending-libraries-list">
                ${libraries.map(library => `
                    <div class="pending-library-item">
                        <div class="library-details">
                            <h4>${library.name}</h4>
                            <p><strong>System:</strong> ${library.library_system || 'N/A'}</p>
                            <p><strong>Branch:</strong> ${library.branch_name || 'N/A'}</p>
                            <p><strong>Address:</strong> ${library.address || 'N/A'}</p>
                            <p><strong>City:</strong> ${library.city}, ${library.county}</p>
                            <p><strong>Submitted by:</strong> ${library.submitted_by_name || library.submitted_by_username}</p>
                            <p><strong>Date:</strong> ${utils.formatDate(library.submitted_at)}</p>
                        </div>
                        <div class="admin-actions">
                            <button class="btn btn-success" onclick="adminManager.approveLibrary(${library.id})">
                                ✅ Approve
                            </button>
                            <button class="btn btn-danger" onclick="adminManager.rejectLibrary(${library.id})">
                                ❌ Reject
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    async approveLibrary(libraryId) {
        if (!currentUser?.isAdmin) return;
        
        try {
            await api.approveLibrary(libraryId, {
                reviewed_by: currentUser.id,
                admin_notes: 'Approved by admin'
            });
            
            utils.showNotification('Library approved successfully!');
            await libraryManager.loadLibraries(); // Refresh library list
            this.openPendingLibraries(); // Refresh pending list
        } catch (error) {
            console.error('Error approving library:', error);
            utils.showNotification('Error approving library', 'error');
        }
    },
    
    async rejectLibrary(libraryId) {
        if (!currentUser?.isAdmin) return;
        
        const reason = prompt('Reason for rejection (optional):');
        
        try {
            await api.rejectLibrary(libraryId, {
                reviewed_by: currentUser.id,
                admin_notes: reason || 'Rejected by admin'
            });
            
            utils.showNotification('Library rejected successfully!');
            this.openPendingLibraries(); // Refresh pending list
        } catch (error) {
            console.error('Error rejecting library:', error);
            utils.showNotification('Error rejecting library', 'error');
        }
    },
    
    async toggleAdminMode() {
        if (!currentUser) return;
        
        const action = currentUser.isAdmin ? 'disable' : 'enable';
        const confirmMessage = currentUser.isAdmin 
            ? 'Are you sure you want to disable admin mode? You will lose admin privileges.'
            : 'Are you sure you want to enable admin mode? You will gain admin privileges.';
        
        if (!confirm(confirmMessage)) return;
        
        try {
            const result = await api.toggleAdminMode(currentUser.id, action);
            
            // Update current user
            currentUser.isAdmin = result.isAdmin;
            currentUser.adminRole = result.role;
            
            // Save to storage and update UI
            userManager.saveUserToStorage();
            userManager.renderUserProfile();
            
            utils.showNotification(result.message, 'success');
        } catch (error) {
            console.error('Error toggling admin mode:', error);
            utils.showNotification('Error toggling admin mode', 'error');
        }
    },
    
    async openAdminUsers() {
        if (!currentUser?.isAdmin) {
            utils.showNotification('Admin access required', 'error');
            return;
        }
        
        try {
            const adminUsers = await api.getAllAdminUsers();
            this.renderAdminUsers(adminUsers);
            modalManager.open(elements.adminUsersModal);
        } catch (error) {
            console.error('Error loading admin users:', error);
            utils.showNotification('Error loading admin users', 'error');
        }
    },
    
    renderAdminUsers(users) {
        const adminUsersContent = document.getElementById('adminUsersContent');
        if (!adminUsersContent) return;
        
        if (users.length === 0) {
            adminUsersContent.innerHTML = '<p>No admin users found.</p>';
            return;
        }
        
        adminUsersContent.innerHTML = `
            <div class="admin-users-list">
                ${users.map(user => `
                    <div class="admin-user-item">
                        <div class="user-details">
                            <h4>${user.display_name || user.username}</h4>
                            <p><strong>Username:</strong> ${user.username}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Role:</strong> ${user.role}</p>
                            <p><strong>Admin since:</strong> ${utils.formatDate(user.created_at)}</p>
                        </div>
                        <div class="admin-user-actions">
                            ${user.user_id !== currentUser.id ? `
                                <button class="btn btn-danger" onclick="adminManager.removeAdminUser(${user.user_id})">
                                    Remove Admin
                                </button>
                            ` : '<span class="current-user-badge">Current User</span>'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    async removeAdminUser(userId) {
        if (!currentUser?.isAdmin) return;
        
        if (!confirm('Are you sure you want to remove this user\'s admin privileges?')) return;
        
        try {
            await api.toggleAdminMode(userId, 'disable');
            utils.showNotification('Admin privileges removed successfully!');
            this.openAdminUsers(); // Refresh the list
        } catch (error) {
            console.error('Error removing admin user:', error);
            utils.showNotification('Error removing admin user', 'error');
        }
    }
};

// Library management
const libraryManager = {
    async loadLibraries() {
        try {
            utils.showLoading();
            libraries = await api.getLibraries();
            this.renderLibraries(libraries);
            this.updateStats();
        } catch (error) {
            console.error('Error loading libraries:', error);
            utils.showNotification('Error loading libraries', 'error');
        } finally {
            utils.hideLoading();
        }
    },
    
    async loadLibrarySystems() {
        try {
            librarySystems = await api.getLibrarySystems();
            this.renderLibrarySystems();
        } catch (error) {
            console.error('Error loading library systems:', error);
        }
    },
    
    async searchLibraries() {
        const query = elements.searchInput.value.trim();
        const county = elements.countyFilter.value;
        const librarySystem = elements.librarySystemFilter ? elements.librarySystemFilter.value : '';
        
        try {
            utils.showLoading();
            const results = await api.searchLibraries(query, county, librarySystem);
            this.renderLibraries(results);
            
            if (results.length === 0) {
                utils.showNoResults();
            }
        } catch (error) {
            console.error('Error searching libraries:', error);
            utils.showNotification('Error searching libraries', 'error');
        } finally {
            utils.hideLoading();
        }
    },
    
    renderLibraries(libraries) {
        if (libraries.length === 0) {
            utils.showNoResults();
            return;
        }
        
        // Group libraries by system
        const groupedLibraries = this.groupLibrariesBySystem(libraries);
        
        elements.librariesGrid.innerHTML = Object.entries(groupedLibraries).map(([system, branches]) => `
            <div class="library-system-group">
                <div class="system-header">
                    <h3 class="system-name">${system}</h3>
                    <div class="system-stats">
                        <span>${branches.length} branch${branches.length > 1 ? 'es' : ''}</span>
                        <span>•</span>
                        <span>${branches.reduce((sum, lib) => sum + (lib.image_count || 0), 0)} images</span>
                        <span>•</span>
                        <span>${branches.reduce((sum, lib) => sum + (lib.visit_count || 0), 0)} visits</span>
                    </div>
                </div>
                <div class="branches-grid">
                    ${branches.map(library => `
                        <div class="library-card" data-id="${library.id}">
                            <div class="library-header">
                                <div>
                                    <div class="library-name">${library.branch_name || library.name}</div>
                                    <div class="library-location">${library.city}, ${library.county}</div>
                                    ${library.branch_name ? `<div class="library-system">${library.library_system}</div>` : ''}
                                </div>
                            </div>
                            <div class="library-stats">
                                <div class="stat-item">
                                    <span>📷</span>
                                    <span>${library.image_count || 0} images</span>
                                </div>
                                <div class="stat-item">
                                    <span>👥</span>
                                    <span>${library.visit_count || 0} visits</span>
                                </div>
                            </div>
                            <div class="library-actions">
                                <button class="action-btn view-details-btn">View Details</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        elements.librariesGrid.querySelectorAll('.library-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('action-btn')) {
                    const libraryId = card.dataset.id;
                    this.openLibraryDetail(libraryId);
                }
            });
            
            card.querySelector('.view-details-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const libraryId = card.dataset.id;
                this.openLibraryDetail(libraryId);
            });
        });
    },
    
    groupLibrariesBySystem(libraries) {
        const grouped = {};
        libraries.forEach(library => {
            const system = library.library_system || 'Other Libraries';
            if (!grouped[system]) {
                grouped[system] = [];
            }
            grouped[system].push(library);
        });
        return grouped;
    },
    
    renderLibrarySystems() {
        if (!elements.librarySystemFilter) return;
        
        elements.librarySystemFilter.innerHTML = '<option value="">All Library Systems</option>' +
            librarySystems.map(system => `<option value="${system.library_system}">${system.library_system} (${system.branch_count} branches)</option>`).join('');
    },
    
    updateStats() {
        const totalImages = libraries.reduce((sum, lib) => sum + (lib.image_count || 0), 0);
        const totalVisits = libraries.reduce((sum, lib) => sum + (lib.visit_count || 0), 0);
        
        elements.totalLibraries.textContent = libraries.length;
        elements.totalImages.textContent = totalImages;
        elements.totalVisits.textContent = totalVisits;
    },
    
    async openLibraryDetail(libraryId) {
        try {
            currentLibraryId = libraryId;
            const library = await api.getLibrary(libraryId);
            
            // Update modal content
            elements.detailLibraryName.textContent = library.branch_name || library.name;
            if (library.library_system && library.branch_name) {
                elements.detailLibraryName.textContent += ` (${library.library_system})`;
            }
            
            elements.detailAddress.textContent = library.address || '-';
            elements.detailCity.textContent = library.city || '-';
            elements.detailCounty.textContent = library.county || '-';
            elements.detailPhone.textContent = library.phone || '-';
            
            if (library.website) {
                elements.detailWebsite.href = library.website;
                elements.detailWebsite.textContent = library.website;
            } else {
                elements.detailWebsite.href = '#';
                elements.detailWebsite.textContent = '-';
            }
            
            // Load images and visits
            await this.loadLibraryImages(libraryId);
            await this.loadLibraryVisits(libraryId);
            
            // Open modal
            modalManager.open(elements.libraryDetailModal);
            
        } catch (error) {
            console.error('Error loading library details:', error);
            utils.showNotification('Error loading library details', 'error');
        }
    },
    
    async loadLibraryImages(libraryId) {
        try {
            const images = await api.getImages(libraryId);
            this.renderImages(images);
        } catch (error) {
            console.error('Error loading images:', error);
            utils.showNotification('Error loading images', 'error');
        }
    },
    
    renderImages(images) {
        if (images.length === 0) {
            elements.imagesGrid.innerHTML = '<p style="text-align: center; color: #718096;">No images uploaded yet.</p>';
            return;
        }
        
        elements.imagesGrid.innerHTML = images.map(image => `
            <div class="image-item">
                <img src="/uploads/${image.filename}" alt="${image.description || 'Library image'}" loading="lazy">
                <div class="image-info">
                    <div class="image-description">${image.description || 'No description'}</div>
                    <div class="image-meta">
                        By ${image.uploaded_by || 'Anonymous'} • ${utils.formatDate(image.created_at)}
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    async loadLibraryVisits(libraryId) {
        try {
            const visits = await api.getVisits(libraryId);
            this.renderVisits(visits);
        } catch (error) {
            console.error('Error loading visits:', error);
            utils.showNotification('Error loading visits', 'error');
        }
    },
    
    renderVisits(visits) {
        if (visits.length === 0) {
            elements.visitsList.innerHTML = '<p style="text-align: center; color: #718096;">No visits recorded yet.</p>';
            return;
        }
        
        elements.visitsList.innerHTML = visits.map(visit => `
            <div class="visit-item">
                <div class="visit-header">
                    <div class="visit-name">${visit.visitor_name || 'Anonymous'}</div>
                    <div class="visit-date">${utils.formatDate(visit.visit_date)}</div>
                </div>
                <div class="visit-notes">${visit.notes || 'No notes provided.'}</div>
            </div>
        `).join('');
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
            const result = await api.addLibrary(libraryData);
            modalManager.close(elements.addLibraryModal);
            event.target.reset();
            
            if (currentUser) {
                utils.showNotification('Library submitted for verification!');
            } else {
                utils.showNotification('Library added successfully!');
            }
        } catch (error) {
            console.error('Error adding library:', error);
            utils.showNotification('Error adding library', 'error');
        }
    },
    
    async handleUploadImage(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        try {
            await api.uploadImage(currentLibraryId, formData);
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
    
    async handleAddVisit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const visitData = {
            user_id: currentUser?.id || null,
            visitor_name: formData.get('visitor_name'),
            notes: formData.get('notes'),
            rating: formData.get('rating') ? parseInt(formData.get('rating')) : null
        };
        
        try {
            await api.addVisit(currentLibraryId, visitData);
            modalManager.close(elements.addVisitModal);
            event.target.reset();
            await libraryManager.loadLibraryVisits(currentLibraryId);
            await libraryManager.loadLibraries(); // Refresh stats
            
            // Reload user data if logged in
            if (currentUser) {
                await userManager.loadUserData();
            }
            
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

// Tab management
const tabManager = {
    init() {
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
    },
    
    switchTab(tabName) {
        // Update tab buttons
        elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        elements.imagesTab.classList.toggle('active', tabName === 'images');
        elements.visitsTab.classList.toggle('active', tabName === 'visits');
    }
};

// County filter management
const countyManager = {
    async loadCounties() {
        try {
            counties = await api.getCounties();
            this.renderCounties();
        } catch (error) {
            console.error('Error loading counties:', error);
        }
    },
    
    renderCounties() {
        elements.countyFilter.innerHTML = '<option value="">All Counties</option>' +
            counties.map(county => `<option value="${county}">${county}</option>`).join('');
    }
};

// Event listeners
function initEventListeners() {
    // Search and filters
    elements.searchBtn.addEventListener('click', () => libraryManager.searchLibraries());
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            libraryManager.searchLibraries();
        }
    });
    elements.countyFilter.addEventListener('change', () => libraryManager.searchLibraries());
    if (elements.librarySystemFilter) {
        elements.librarySystemFilter.addEventListener('change', () => libraryManager.searchLibraries());
    }
    
    // Add library
    elements.addLibraryBtn.addEventListener('click', () => modalManager.open(elements.addLibraryModal));
    
    // User authentication
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => modalManager.open(elements.loginModal));
    }
    if (elements.registerBtn) {
        elements.registerBtn.addEventListener('click', () => modalManager.open(elements.registerModal));
    }
    if (elements.userProfileBtn) {
        elements.userProfileBtn.addEventListener('click', () => userManager.openUserProfile());
    }
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', () => userManager.logout());
    }
    
    // Modal close buttons
    elements.closeAddLibraryModal.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.closeLibraryDetailModal.addEventListener('click', () => modalManager.close(elements.libraryDetailModal));
    elements.closeUploadImageModal.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.closeAddVisitModal.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    if (elements.closeLoginModal) {
        elements.closeLoginModal.addEventListener('click', () => modalManager.close(elements.loginModal));
    }
    if (elements.closeRegisterModal) {
        elements.closeRegisterModal.addEventListener('click', () => modalManager.close(elements.registerModal));
    }
    if (elements.closeUserProfileModal) {
        elements.closeUserProfileModal.addEventListener('click', () => modalManager.close(elements.userProfileModal));
    }
    if (elements.closeAdminModal) {
        elements.closeAdminModal.addEventListener('click', () => modalManager.close(elements.adminModal));
    }
    if (elements.closeAdminUsersModal) {
        elements.closeAdminUsersModal.addEventListener('click', () => modalManager.close(elements.adminUsersModal));
    }
    
    // Cancel buttons
    elements.cancelAddLibrary.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.cancelUploadImage.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.cancelAddVisit.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    if (elements.cancelLogin) {
        elements.cancelLogin.addEventListener('click', () => modalManager.close(elements.loginModal));
    }
    if (elements.cancelRegister) {
        elements.cancelRegister.addEventListener('click', () => modalManager.close(elements.registerModal));
    }
    
    // Forms
    elements.addLibraryForm.addEventListener('submit', formHandlers.handleAddLibrary);
    elements.uploadImageForm.addEventListener('submit', formHandlers.handleUploadImage);
    elements.addVisitForm.addEventListener('submit', formHandlers.handleAddVisit);
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', formHandlers.handleLogin);
    }
    if (elements.registerForm) {
        elements.registerForm.addEventListener('submit', formHandlers.handleRegister);
    }
    
    // Action buttons in library detail
    elements.uploadImageBtn.addEventListener('click', () => modalManager.open(elements.uploadImageModal));
    elements.addVisitBtn.addEventListener('click', () => modalManager.open(elements.addVisitModal));
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modalManager.close(modal);
            }
        });
    });
    
    // Initialize tabs
    tabManager.init();
}

// Initialize app
async function initApp() {
    try {
        // Initialize user management first
        userManager.init();
        
        await Promise.all([
            libraryManager.loadLibraries(),
            libraryManager.loadLibrarySystems(),
            countyManager.loadCounties()
        ]);
        
        initEventListeners();
        
        console.log('Library tracking app initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
        utils.showNotification('Error initializing app', 'error');
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

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 