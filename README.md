# 📚 California Library Tracker

A web application for tracking and exploring California public libraries. It ships in **two flavours** so you can pick whichever fits your needs:

- **Server version** (`server.js`, `public/`) — a Node.js + Express + SQLite app with user accounts, image uploads, and an admin verification workflow.
- **Static version** (`static-version/`) — a zero-backend build that runs entirely in the browser using IndexedDB, ideal for GitHub Pages / Netlify hosting. No account required.

### Which version should I use?

- **Just want to track libraries, or host for free?** Use the **static version**. It needs no server, no database, and no accounts — open it and go. This is the recommended path for most people and is what recent development targets.
- **Need shared, multi-user data with a central database, uploads, and admin moderation?** Use the **server version**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![SQLite](https://img.shields.io/badge/SQLite-3.x-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🏛️ Library Management
- Curated database of California public libraries (94 in the server build, 29 preset in the static build)
- Organized by library system and branch
- Search and filter by name, county, or library system

### 👥 User System *(server version)*
- Registration and login with salted password hashing
- Personal profiles tracking visits and contributions
- Visit history with notes and 1–5 ratings
- Personal library goals / checklists

### 📸 Image Crowdsourcing
- Photo uploads for each library
- Automatic resizing and optimization (server version uses Sharp)
- Community gallery view

### 🔐 Admin Verification *(server version)*
- User-submitted libraries land in a pending queue
- Admins approve or reject submissions with notes
- Toggleable admin privileges

### 📊 Statistics
- Visit tracking and per-user activity
- County exploration progress
- Visual progress indicators

## 🛠️ Technology Stack

| | Server version | Static version |
| --- | --- | --- |
| Backend | Node.js, Express | None (browser only) |
| Storage | SQLite3 | IndexedDB + localStorage |
| Frontend | Vanilla JS, HTML5, CSS3 | Vanilla JS, HTML5, CSS3 |
| Images | Sharp + Multer | File API / data URLs |
| Security | Helmet, Compression, scrypt | Client-side only |

## 🚀 Quick Start (server version)

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/kingstonlee/openLibraryChecklist.git
cd openLibraryChecklist
npm install
cp .env.example .env   # optional: adjust PORT / NODE_ENV
npm run dev            # or: npm start
```

Then open http://localhost:3000.

### Database setup

The SQLite database is created automatically on first run. To seed it with the preset library data:

```bash
node server.js &                    # start the server (creates the DB)
node scripts/populate-libraries.js  # populate libraries
```

### Admin setup

```bash
node scripts/setup-admin.js add <username> admin   # grant admin
node scripts/setup-admin.js list                   # list admins
```

## 🌐 Quick Start (static version)

No build step or server required:

```bash
cd static-version
python -m http.server 8000   # or: npx http-server
```

Open http://localhost:8000. See [`static-version/README.md`](static-version/README.md) for hosting on GitHub Pages, Netlify, or Vercel.

## 🧪 Tests

Unit tests run on Node's built-in test runner (no extra dependencies):

```bash
npm test
```

CI runs the test suite and syntax checks on Node 18, 20, and 22 for every push and pull request (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## 📁 Project Structure

```
openLibraryChecklist/
├── server.js                  # Main Express server
├── lib/
│   └── password.js            # Salted scrypt password hashing
├── test/
│   └── password.test.js       # Unit tests
├── public/                    # Server-version static assets
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── uploads/               # User-uploaded images
├── static-version/            # Standalone browser-only build
├── scripts/                   # Utility scripts
│   ├── populate-libraries.js  # Seed the database
│   ├── setup-admin.js         # Manage admin users
│   └── deploy.sh
├── BRANCHING_STRATEGY.md
├── DEPLOYMENT.md
├── VERIFICATION_SYSTEM.md
└── GITHUB_SETUP.md
```

## 🔧 API Endpoints (server version)

### Libraries
- `GET /api/libraries` — list all libraries
- `GET /api/libraries/:id` — get a specific library
- `POST /api/libraries` — submit a new library (goes to the pending queue)
- `GET /api/search` — search libraries
- `GET /api/counties` — distinct counties
- `GET /api/library-systems` — library systems with counts

### User management
- `POST /api/auth/register` — register
- `POST /api/auth/login` — log in
- `GET /api/users/:id` — profile
- `GET /api/users/:id/stats` — statistics
- `GET /api/users/:id/visits` — visit history
- `GET /api/users/:id/goals` — library goals

### Admin
- `GET /api/admin/pending-libraries` — pending submissions
- `POST /api/admin/pending-libraries/:id/approve` — approve
- `POST /api/admin/pending-libraries/:id/reject` — reject
- `POST /api/users/:id/toggle-admin` — toggle admin mode

## 🔒 Security Notes

- Passwords in the server version are hashed with salted **scrypt** (Node's built-in `crypto`); plaintext passwords are never stored.
- Login issues a signed session token (HMAC-SHA256 via Node's `crypto`, keyed by `SESSION_SECRET`). The client returns it as an `Authorization: Bearer` token, and the server derives the acting user from the verified token — so an identity can't be forged by setting a header.
- Admin endpoints (`/api/admin/*`, `toggle-admin`) require the acting user to be an admin; granting admin additionally requires an existing admin or a configured `ADMIN_SETUP_TOKEN`. Bootstrap the first admin with `scripts/setup-admin.js`.
- CORS is restricted to the origins listed in `CORS_ORIGINS` (cross-origin requests are otherwise not granted access).
- Authentication endpoints are rate-limited to slow down brute-force attempts.
- User-supplied content is HTML-escaped in the front-end before rendering to prevent stored XSS.
- `helmet` sets a Content Security Policy and other protective headers.
- The static version stores all data locally in the browser and sends nothing to a server.

## 🚀 Deployment

- **Server version:** see [DEPLOYMENT.md](DEPLOYMENT.md). Compatible with Dreamhost Apps, Heroku, Railway, and similar Node hosts.
- **Static version:** deploy the `static-version/` folder to GitHub Pages, Netlify, or Vercel.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Guidelines
- Follow the existing code style
- Add tests for new backend logic and ensure `npm test` passes
- Update documentation as needed

## 📝 License

Licensed under the MIT License — see [LICENSE](LICENSE).

## 🙏 Acknowledgments

- California public libraries for the underlying data
- The open-source community for the tools that make this possible

---

*Help build a comprehensive library tracking tool for California's library community.*
