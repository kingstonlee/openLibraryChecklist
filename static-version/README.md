# 📚 California Library Tracker - Static Version

A **completely static** version of the California Library Tracker that runs entirely in the browser with no server required!

## ✨ Features

### 🏛️ **Library Management**
- **Add Libraries**: Add new libraries directly in the browser
- **Search & Filter**: Find libraries by name, county, or library system
- **Map View**: See every library plotted on a California map (self-contained SVG, no external map service); click a dot to open its details
- **Library Details**: View complete library information
- **Statistics**: Real-time stats on libraries, images, visits, and users

### 👥 **User System**
- **User Registration & Login**: Secure authentication using browser storage
- **Personal Profiles**: Track your library visits and contributions
- **Visit History**: Record and rate your library visits
- **Session Management**: Persistent login across browser sessions

### 📸 **Image Crowdsourcing**
- **Photo Uploads**: Upload images directly from your device
- **Image Storage**: Images stored as data URLs in browser storage
- **Gallery View**: Browse library photos contributed by users
- **Image Captions**: Add descriptions to your uploaded images

### 🔐 **Data Persistence**
- **IndexedDB**: Robust client-side database for all data
- **LocalStorage**: User session and preferences storage
- **Offline Capable**: Works without internet connection
- **Data Export**: All data stored locally in your browser

## 🚀 Quick Start

### Option 1: Direct File Opening
1. **Download the files** from the `static-version` folder
2. **Open `index.html`** in your web browser
3. **Start using the app!** No server setup required

### Option 2: Local Server (Recommended)
1. **Navigate to the static-version folder**
   ```bash
   cd static-version
   ```

2. **Start a local server** (any of these options):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Open your browser** to `http://localhost:8000`

### Option 3: GitHub Pages
1. **Upload the static-version folder** to a GitHub repository
2. **Enable GitHub Pages** in repository settings
3. **Access your live site** at `https://yourusername.github.io/repository-name`

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: IndexedDB (for data), localStorage (for sessions)
- **Image Handling**: File API, Canvas API
- **No Dependencies**: Pure browser APIs only

## 📁 File Structure

```
static-version/
├── index.html              # Main application page
├── style.css               # Complete styling
├── app.js                  # All application logic
├── data.js                 # Preset California libraries data
├── add-more-libraries.js   # Utility functions for adding more libraries
├── README.md               # This file
└── DEPLOYMENT.md           # Deployment guide
```

## 🔧 How It Works

### Data Storage
- **IndexedDB**: Stores libraries, images, visits, and users
- **LocalStorage**: Stores user sessions and preferences
- **Data URLs**: Images are converted to base64 strings for storage

### Authentication
- **Client-side**: All authentication is handled in the browser and is optional — the app works without an account
- **Password Handling**: Accounts are a local convenience only. Passwords are passed through a simple non-cryptographic hash before being stored in the browser; because all data lives on the same device, this is obfuscation, not real security. Do not reuse an important password here.
- **Session Management**: Automatic login persistence via localStorage

### Image Handling
- **File API**: Reads image files from user's device
- **Canvas API**: Processes and resizes images if needed
- **Data URLs**: Converts images to base64 for storage

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create a new repository
2. Upload the static-version files
3. Enable GitHub Pages in settings
4. Your site is live!

### Netlify (Free)
1. Drag and drop the static-version folder to Netlify
2. Your site is instantly deployed
3. Get a custom domain option

### Vercel (Free)
1. Connect your GitHub repository
2. Vercel automatically detects static files
3. Deploy with one click

### Any Web Server
- Upload files to any web hosting service
- Works with Apache, Nginx, or any static file server

## 📊 Data Management

### Adding Initial Libraries
The static version comes with **30+ preset California libraries** from major library systems including:

- **Los Angeles Public Library** (5 branches)
- **San Francisco Public Library** (5 branches) 
- **San Diego Public Library** (3 branches)
- **Sacramento Public Library** (2 branches)
- **Oakland Public Library** (2 branches)
- **And many more** from cities across California

### 🔄 **Continuous Library Updates**
The app includes a **versioned library update system** that allows you to:

1. **Add new libraries safely** without affecting user data
2. **Update existing libraries** with new information
3. **Track update history** and rollback if needed
4. **Preserve all user data** during updates

#### **Admin Panel**
Access the admin panel at: `admin-panel.html`

**Features:**
- 📊 **Database Statistics**: View counts of libraries, users, images, visits
- 🔄 **Library Updates**: Check for and apply new library updates
- ➕ **Add Libraries**: Add individual libraries with a form
- 📦 **Bulk Import**: Import multiple libraries via JSON
- 🗄️ **Data Management**: Export/import all data
- 📝 **Activity Log**: Track all admin actions

#### **Console Commands**
```javascript
// Check for library updates
checkForLibraryUpdates()

// Get update history
getLibraryUpdateHistory()

// Add a single library
addSingleLibrary({
    name: "Library Name",
    address: "123 Main St",
    city: "City",
    county: "County"
})

// Add multiple libraries
addMultipleLibraries([library1, library2, library3])

// Reset to specific version
resetToLibraryVersion("1.0.0")
```

#### **Adding New Libraries**
You can add libraries in several ways:

1. **Admin Panel**: Use the web interface at `admin-panel.html`
2. **Browser Console**: Use the JavaScript functions above
3. **Update Library Updater**: Add new versions to `library-updater.js`
4. **Bulk Import**: Import JSON data with multiple libraries

### Data Export/Import
```javascript
// Export all data
const exportData = {
    libraries: await storage.getAll('libraries'),
    images: await storage.getAll('images'),
    visits: await storage.getAll('visits'),
    users: await storage.getAll('users')
};

// Import data
// (Implementation can be added to the app)
```

## 🔒 Privacy & Security

### Data Privacy
- **Local Storage**: All data stays in your browser
- **No Server**: No data sent to external servers
- **User Control**: Complete control over your data

### Security Features
- **XSS Protection**: User-supplied text (library names, notes, captions) is HTML-escaped before rendering, and website links are restricted to `http`/`https` schemes
- **Local-only data**: Nothing is sent to a server, so there is no network attack surface
- **Note**: The client-side password hash is obfuscation only (see Authentication above), not a real security control

## 🎯 Use Cases

### Personal Library Tracking
- Track libraries you've visited
- Upload photos of your visits
- Rate and review libraries
- Set personal goals

### Community Sharing
- Share the static version with others
- Each user has their own local data
- No centralized server required

### Offline Use
- Works completely offline
- Perfect for areas with limited internet
- Data persists between sessions

## 🚀 Advantages of Static Version

### ✅ **Pros**
- **No Server Required**: Runs entirely in the browser
- **Free Hosting**: Can be hosted on GitHub Pages, Netlify, etc.
- **Fast Loading**: No server requests needed
- **Offline Capable**: Works without internet
- **Privacy**: All data stays local
- **Easy Deployment**: Just upload files to any web server

### ⚠️ **Limitations**
- **No Data Sharing**: Each user has separate data
- **Storage Limits**: Browser storage has size limits
- **No Real-time Sync**: Changes don't sync across devices
- **Limited Image Storage**: Large images consume storage space

## 🔄 Migration from Server Version

If you want to migrate data from the server version:

1. **Export data** from the server version
2. **Add import functionality** to the static version
3. **Initialize the database** with your existing data

## 🤝 Contributing

To improve the static version:

1. **Fork the repository**
2. **Make your changes**
3. **Test thoroughly** in different browsers
4. **Submit a pull request**

## 📝 Browser Compatibility

- **Chrome**: 60+ ✅
- **Firefox**: 55+ ✅
- **Safari**: 11+ ✅
- **Edge**: 79+ ✅
- **Mobile Browsers**: iOS Safari 11+, Chrome Mobile 60+ ✅

## 🎉 Getting Started

1. **Download the files**
2. **Open index.html** in your browser
3. **Register an account**
4. **Start adding libraries!**

---

**Happy Library Tracking! 📚✨**

*This static version gives you all the functionality of the server version, but runs entirely in your browser with no external dependencies.* 