// Cloud Sync Module for Library Tracker
// Provides data synchronization between devices using cloud storage and data export/import

const cloudSync = {
    // Generate a unique user ID for cloud sync
    generateUserId() {
        let userId = localStorage.getItem('libraryTrackerUserId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('libraryTrackerUserId', userId);
        }
        return userId;
    },

    // Export all user data as JSON
    async exportUserData() {
        try {
            const userId = this.generateUserId();
            const exportData = {
                userId: userId,
                timestamp: new Date().toISOString(),
                version: '1.0',
                data: {
                    libraries: await storage.getLibraries(),
                    users: await storage.getUsers(),
                    visits: await storage.getVisits(),
                    images: await storage.getImages(),
                    adminUsers: await storage.getAdminUsers()
                },
                settings: {
                    libraryTrackerVersion: localStorage.getItem('libraryTrackerVersion'),
                    userPreferences: localStorage.getItem('userPreferences'),
                    lastSync: new Date().toISOString()
                }
            };

            return {
                success: true,
                data: exportData,
                filename: `library-tracker-backup-${userId}-${new Date().toISOString().split('T')[0]}.json`
            };
        } catch (error) {
            console.error('Error exporting user data:', error);
            return { success: false, error: error.message };
        }
    },

    // Import user data from JSON
    async importUserData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (!data.data || !data.userId) {
                throw new Error('Invalid backup file format');
            }

            // Validate data structure
            const requiredKeys = ['libraries', 'users', 'visits', 'images', 'adminUsers'];
            for (const key of requiredKeys) {
                if (!Array.isArray(data.data[key])) {
                    throw new Error(`Missing or invalid ${key} data`);
                }
            }

            // Clear existing data
            await storage.clearAllData();

            // Import data
            let importedCount = 0;
            for (const library of data.data.libraries) {
                await storage.addLibrary(library);
                importedCount++;
            }

            for (const user of data.data.users) {
                await storage.addUser(user);
                importedCount++;
            }

            for (const visit of data.data.visits) {
                await storage.addVisit(visit);
                importedCount++;
            }

            for (const image of data.data.images) {
                await storage.addImage(image);
                importedCount++;
            }

            for (const adminUser of data.data.adminUsers) {
                await storage.addAdminUser(adminUser);
                importedCount++;
            }

            // Restore settings
            if (data.settings) {
                if (data.settings.libraryTrackerVersion) {
                    localStorage.setItem('libraryTrackerVersion', data.settings.libraryTrackerVersion);
                }
                if (data.settings.userPreferences) {
                    localStorage.setItem('userPreferences', data.settings.userPreferences);
                }
            }

            return {
                success: true,
                message: `Successfully imported ${importedCount} items`,
                importedCount: importedCount
            };
        } catch (error) {
            console.error('Error importing user data:', error);
            return { success: false, error: error.message };
        }
    },

    // Download backup file
    downloadBackup() {
        this.exportUserData().then(result => {
            if (result.success) {
                const blob = new Blob([JSON.stringify(result.data, null, 2)], {
                    type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showStatus('Backup downloaded successfully!', 'success');
            } else {
                showStatus('Failed to create backup: ' + result.error, 'error');
            }
        });
    },

    // Upload and restore backup file
    uploadBackup(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await this.importUserData(e.target.result);
                if (result.success) {
                    showStatus(`Backup restored successfully! Imported ${result.importedCount} items.`, 'success');
                    // Refresh the app
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    showStatus('Failed to restore backup: ' + result.error, 'error');
                }
            } catch (error) {
                showStatus('Error reading backup file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    // Generate QR code for data sharing
    generateQRCode(data) {
        // This would integrate with a QR code library
        // For now, we'll create a data URL that can be shared
        const dataUrl = 'data:application/json;base64,' + btoa(JSON.stringify(data));
        return dataUrl;
    },

    // Sync with cloud storage (Google Drive, Dropbox, etc.)
    async syncWithCloud(provider = 'local') {
        try {
            const userId = this.generateUserId();
            const exportResult = await this.exportUserData();
            
            if (!exportResult.success) {
                throw new Error(exportResult.error);
            }

            // For now, we'll use localStorage as a simple cloud sync
            // In a real implementation, this would integrate with actual cloud APIs
            const cloudKey = `libraryTracker_cloud_${userId}`;
            localStorage.setItem(cloudKey, JSON.stringify(exportResult.data));
            localStorage.setItem(`${cloudKey}_timestamp`, new Date().toISOString());

            return {
                success: true,
                message: 'Data synced to cloud storage',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error syncing with cloud:', error);
            return { success: false, error: error.message };
        }
    },

    // Restore from cloud storage
    async restoreFromCloud() {
        try {
            const userId = this.generateUserId();
            const cloudKey = `libraryTracker_cloud_${userId}`;
            const cloudData = localStorage.getItem(cloudKey);
            
            if (!cloudData) {
                throw new Error('No cloud backup found');
            }

            const result = await this.importUserData(JSON.parse(cloudData));
            return result;
        } catch (error) {
            console.error('Error restoring from cloud:', error);
            return { success: false, error: error.message };
        }
    },

    // Get sync status
    getSyncStatus() {
        const userId = this.generateUserId();
        const cloudKey = `libraryTracker_cloud_${userId}`;
        const lastSync = localStorage.getItem(`${cloudKey}_timestamp`);
        
        return {
            userId: userId,
            lastSync: lastSync,
            hasCloudBackup: !!localStorage.getItem(cloudKey),
            localDataSize: this.getLocalDataSize()
        };
    },

    // Get local data size
    getLocalDataSize() {
        try {
            const data = {
                libraries: localStorage.getItem('libraries') || '',
                users: localStorage.getItem('users') || '',
                visits: localStorage.getItem('visits') || '',
                images: localStorage.getItem('images') || '',
                adminUsers: localStorage.getItem('adminUsers') || ''
            };
            
            return Object.values(data).reduce((total, item) => total + item.length, 0);
        } catch (error) {
            return 0;
        }
    }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    window.cloudSync = cloudSync;
    window.exportUserData = () => cloudSync.exportUserData();
    window.importUserData = (data) => cloudSync.importUserData(data);
    window.downloadBackup = () => cloudSync.downloadBackup();
    window.syncWithCloud = (provider) => cloudSync.syncWithCloud(provider);
    window.restoreFromCloud = () => cloudSync.restoreFromCloud();
    window.getSyncStatus = () => cloudSync.getSyncStatus();
} 