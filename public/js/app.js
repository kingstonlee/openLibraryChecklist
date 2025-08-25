// Global variables
let currentLibraryId = null;
let libraries = [];
let counties = [];

// DOM elements
const elements = {
    // Search and filters
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    countyFilter: document.getElementById('countyFilter'),
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
    
    // Forms
    addLibraryForm: document.getElementById('addLibraryForm'),
    uploadImageForm: document.getElementById('uploadImageForm'),
    addVisitForm: document.getElementById('addVisitForm'),
    
    // Modal close buttons
    closeAddLibraryModal: document.getElementById('closeAddLibraryModal'),
    closeLibraryDetailModal: document.getElementById('closeLibraryDetailModal'),
    closeUploadImageModal: document.getElementById('closeUploadImageModal'),
    closeAddVisitModal: document.getElementById('closeAddVisitModal'),
    
    // Cancel buttons
    cancelAddLibrary: document.getElementById('cancelAddLibrary'),
    cancelUploadImage: document.getElementById('cancelUploadImage'),
    cancelAddVisit: document.getElementById('cancelAddVisit'),
    
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
    addVisitBtn: document.getElementById('addVisitBtn')
};

// API functions
const api = {
    async getLibraries() {
        const response = await fetch('/api/libraries');
        return await response.json();
    },
    
    async searchLibraries(query, county) {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (county) params.append('county', county);
        
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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
    
    async searchLibraries() {
        const query = elements.searchInput.value.trim();
        const county = elements.countyFilter.value;
        
        try {
            utils.showLoading();
            const results = await api.searchLibraries(query, county);
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
        
        elements.librariesGrid.innerHTML = libraries.map(library => `
            <div class="library-card" data-id="${library.id}">
                <div class="library-header">
                    <div>
                        <div class="library-name">${library.name}</div>
                        <div class="library-location">${library.city}, ${library.county}</div>
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
            elements.detailLibraryName.textContent = library.name;
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
        
        try {
            await api.addLibrary(libraryData);
            modalManager.close(elements.addLibraryModal);
            event.target.reset();
            await libraryManager.loadLibraries();
            utils.showNotification('Library added successfully!');
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
        const visitData = Object.fromEntries(formData.entries());
        
        try {
            await api.addVisit(currentLibraryId, visitData);
            modalManager.close(elements.addVisitModal);
            event.target.reset();
            await libraryManager.loadLibraryVisits(currentLibraryId);
            await libraryManager.loadLibraries(); // Refresh stats
            utils.showNotification('Visit recorded successfully!');
        } catch (error) {
            console.error('Error adding visit:', error);
            utils.showNotification('Error recording visit', 'error');
        }
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
    
    // Add library
    elements.addLibraryBtn.addEventListener('click', () => modalManager.open(elements.addLibraryModal));
    
    // Modal close buttons
    elements.closeAddLibraryModal.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.closeLibraryDetailModal.addEventListener('click', () => modalManager.close(elements.libraryDetailModal));
    elements.closeUploadImageModal.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.closeAddVisitModal.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    
    // Cancel buttons
    elements.cancelAddLibrary.addEventListener('click', () => modalManager.close(elements.addLibraryModal));
    elements.cancelUploadImage.addEventListener('click', () => modalManager.close(elements.uploadImageModal));
    elements.cancelAddVisit.addEventListener('click', () => modalManager.close(elements.addVisitModal));
    
    // Forms
    elements.addLibraryForm.addEventListener('submit', formHandlers.handleAddLibrary);
    elements.uploadImageForm.addEventListener('submit', formHandlers.handleUploadImage);
    elements.addVisitForm.addEventListener('submit', formHandlers.handleAddVisit);
    
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
        await Promise.all([
            libraryManager.loadLibraries(),
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