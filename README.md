# 📚 California Library Tracker

A comprehensive web application for tracking and exploring California public libraries. Built with Node.js, Express, SQLite, and modern web technologies.

![Library Tracker](https://img.shields.io/badge/Node.js-16+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![SQLite](https://img.shields.io/badge/SQLite-3.x-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🏛️ **Library Management**
- **94 California Libraries**: Comprehensive database of public libraries across California
- **Library Systems & Branches**: Organized by library systems with multiple branch locations
- **Search & Filter**: Find libraries by name, county, or library system
- **Interactive Map**: Visual library locations with details

### 👥 **User System**
- **User Registration & Login**: Secure authentication system
- **Personal Profiles**: Track your library visits and contributions
- **Visit History**: Record and rate your library visits
- **Library Goals**: Create personal checklists of libraries to visit

### 📸 **Image Crowdsourcing**
- **Photo Uploads**: Users can upload photos of libraries
- **Image Management**: Automatic resizing and optimization
- **Gallery View**: Browse library photos contributed by the community

### 🔐 **Admin Verification System**
- **Library Submissions**: Users can submit new libraries for verification
- **Admin Review**: Admin users can approve/reject submissions
- **Quality Control**: Ensures data accuracy and prevents spam
- **Admin Toggle**: Easy enable/disable of admin privileges

### 📊 **Statistics & Analytics**
- **Visit Tracking**: Monitor library visit statistics
- **User Activity**: Track user contributions and engagement
- **County Exploration**: See which counties you've explored
- **Progress Metrics**: Visual progress indicators

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Image Processing**: Sharp, Multer
- **Security**: Helmet.js, Compression
- **Hosting**: Dreamhost Apps compatible

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/california-library-tracker.git
   cd california-library-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Database Setup

The database will be automatically created on first run. To populate with initial library data:

```bash
# Start the server first (to create database)
node server.js &
# Then populate libraries
node scripts/populate-libraries.js
```

### Admin Setup

Create admin users for the verification system:

```bash
# Make a user an admin
node scripts/setup-admin.js add <username> admin

# List all admin users
node scripts/setup-admin.js list
```

## 📁 Project Structure

```
california-library-tracker/
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── library.db               # SQLite database
├── public/                  # Static files
│   ├── index.html          # Main application page
│   ├── css/style.css       # Stylesheets
│   ├── js/app.js           # Frontend JavaScript
│   └── uploads/            # User uploaded images
├── scripts/                # Utility scripts
│   ├── populate-libraries.js  # Database population
│   └── setup-admin.js         # Admin user management
└── docs/                   # Documentation
    ├── VERIFICATION_SYSTEM.md
    ├── DEPLOYMENT.md
    └── BRANCHING_STRATEGY.md
```

## 🔧 API Endpoints

### Libraries
- `GET /api/libraries` - Get all libraries
- `GET /api/libraries/:id` - Get specific library
- `POST /api/libraries` - Submit new library (requires verification)
- `GET /api/search` - Search libraries

### User Management
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/stats` - Get user statistics

### Admin Functions
- `GET /api/admin/pending-libraries` - Get pending submissions
- `POST /api/admin/pending-libraries/:id/approve` - Approve library
- `POST /api/admin/pending-libraries/:id/reject` - Reject library
- `POST /api/users/:id/toggle-admin` - Toggle admin mode

## 🎯 Key Features in Detail

### Library Verification System
- **User Submissions**: New libraries go to pending status
- **Admin Review**: Admins can approve/reject with notes
- **Quality Control**: Prevents spam and ensures accuracy
- **Audit Trail**: Complete history of submissions and reviews

### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live notifications and status changes
- **Intuitive Interface**: Clean, modern UI with smooth interactions
- **Progress Tracking**: Visual indicators for user goals

### Admin Panel
- **Pending Reviews**: Easy-to-use interface for library submissions
- **User Management**: View and manage admin users
- **Toggle Admin Mode**: Enable/disable admin privileges
- **Statistics Dashboard**: Overview of system activity

## 🚀 Deployment

### Dreamhost Apps Deployment
This app is designed to be deployed on Dreamhost Apps for free hosting. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Other Hosting Options
- **Heroku**: Compatible with Heroku's free tier
- **Vercel**: Can be adapted for serverless deployment
- **Railway**: Easy deployment with automatic scaling

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **California Public Libraries**: For providing the foundation data
- **Open Source Community**: For the amazing tools and libraries
- **Library Enthusiasts**: For inspiration and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/california-library-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/california-library-tracker/discussions)
- **Email**: [Your Email]

---

**Made with ❤️ for California's library community**

*Help us build the most comprehensive library tracking system in California!* 