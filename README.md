# California Library Tracker 📚

A modern web application for tracking and discovering California's public libraries with crowdsourced images and visit tracking.

## Features

- **Library Discovery**: Browse and search California public libraries by name, city, or county
- **Crowdsourced Images**: Users can upload and share photos of libraries
- **Visit Tracking**: Record and share your library visits with notes
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Stats**: Track total libraries, images, and visits
- **Mobile Friendly**: Optimized for all device sizes

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: SQLite (perfect for free hosting)
- **Frontend**: Vanilla JavaScript with modern CSS
- **Image Processing**: Sharp for optimized image uploads
- **Security**: Helmet.js for security headers
- **Performance**: Compression middleware

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd openLibraryChecklist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Populate the database with California libraries**
   ```bash
   node scripts/populate-libraries.js
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000`

## Project Structure

```
openLibraryChecklist/
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── library.db              # SQLite database (created on first run)
├── public/                 # Static files
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── uploads/            # User uploaded images
├── scripts/
│   └── populate-libraries.js # Database population script
└── README.md               # This file
```

## API Endpoints

### Libraries
- `GET /api/libraries` - Get all libraries
- `GET /api/libraries/:id` - Get specific library
- `POST /api/libraries` - Add new library
- `GET /api/search?q=query&county=county` - Search libraries

### Images
- `GET /api/libraries/:id/images` - Get library images
- `POST /api/libraries/:id/images` - Upload image

### Visits
- `GET /api/libraries/:id/visits` - Get library visits
- `POST /api/libraries/:id/visits` - Record visit

### Utilities
- `GET /api/counties` - Get all counties

## Deployment to Dreamhost Apps

### 1. Prepare Your App

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Create a `.gitignore` file** (if not exists)
   ```
   node_modules/
   .env
   *.log
   ```

### 2. Dreamhost Apps Setup

1. **Log into Dreamhost Panel**
   - Go to Domains → Manage Domains
   - Add your domain or subdomain

2. **Create a Dreamhost App**
   - Go to Domains → Dreamhost Apps
   - Click "Create App"
   - Choose "Node.js" as the runtime
   - Select your domain
   - Set the source directory to your app folder

3. **Configure Environment**
   - Set the start command to: `node server.js`
   - Set the Node.js version to: `16.x` or higher

### 3. Deploy

1. **Push to your repository**
   ```bash
   git push origin main
   ```

2. **Connect to Dreamhost**
   - In Dreamhost Apps, connect your Git repository
   - Set the branch to `main`
   - Deploy the app

### 4. Post-Deployment

1. **SSH into your server** (if needed)
   ```bash
   ssh username@your-domain.com
   ```

2. **Install dependencies and populate database**
   ```bash
   cd /home/username/your-app-directory
   npm install
   node scripts/populate-libraries.js
   ```

3. **Restart the app** in Dreamhost panel

## Environment Variables

Create a `.env` file for local development:

```env
PORT=3000
NODE_ENV=development
```

## Database Management

### Reset Database
```bash
rm library.db
node server.js  # This will recreate the database
node scripts/populate-libraries.js
```

### Backup Database
```bash
cp library.db library-backup-$(date +%Y%m%d).db
```

## Adding More Libraries

To add more California libraries, edit `scripts/populate-libraries.js` and add library objects to the `californiaLibraries` array:

```javascript
{
    name: "Library Name",
    address: "123 Main St",
    city: "City Name",
    county: "County Name",
    zip_code: "90210",
    phone: "(555) 123-4567",
    website: "https://library.org",
    latitude: 34.0522,
    longitude: -118.2437
}
```

Then run:
```bash
node scripts/populate-libraries.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own library tracking needs!

## Support

For issues or questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include your Node.js version and operating system

## Roadmap

- [ ] Map integration with library locations
- [ ] User accounts and profiles
- [ ] Library ratings and reviews
- [ ] Events and programs tracking
- [ ] Mobile app version
- [ ] API rate limiting
- [ ] Image moderation system
- [ ] Export/import functionality

---

**Happy Library Tracking! 📚✨** 