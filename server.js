const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./library.db');

// Create tables
db.serialize(() => {
  // Users table for authentication and tracking
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    total_visits INTEGER DEFAULT 0,
    total_images INTEGER DEFAULT 0
  )`);

  // Libraries table
  db.run(`CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    library_system TEXT,
    branch_name TEXT,
    address TEXT,
    city TEXT,
    county TEXT,
    zip_code TEXT,
    phone TEXT,
    website TEXT,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Images table
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    library_id INTEGER,
    user_id INTEGER,
    filename TEXT NOT NULL,
    original_name TEXT,
    description TEXT,
    uploaded_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (library_id) REFERENCES libraries (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Visits table for tracking
  db.run(`CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    library_id INTEGER,
    user_id INTEGER,
    visitor_name TEXT,
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    FOREIGN KEY (library_id) REFERENCES libraries (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // User library goals/checklist
  db.run(`CREATE TABLE IF NOT EXISTS user_library_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    library_id INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'visited', 'completed')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (library_id) REFERENCES libraries (id)
  )`);

  // Pending library submissions for verification
  db.run(`CREATE TABLE IF NOT EXISTS pending_libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submitted_by INTEGER,
    name TEXT NOT NULL,
    library_system TEXT,
    branch_name TEXT,
    address TEXT,
    city TEXT,
    county TEXT,
    zip_code TEXT,
    phone TEXT,
    website TEXT,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by INTEGER,
    FOREIGN KEY (submitted_by) REFERENCES users (id),
    FOREIGN KEY (reviewed_by) REFERENCES users (id)
  )`);

  // Admin users table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    role TEXT DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Get all libraries
app.get('/api/libraries', (req, res) => {
  const query = `
    SELECT l.*, 
           COUNT(DISTINCT i.id) as image_count,
           COUNT(DISTINCT v.id) as visit_count
    FROM libraries l
    LEFT JOIN images i ON l.id = i.library_id
    LEFT JOIN visits v ON l.id = v.library_id
    GROUP BY l.id
    ORDER BY l.library_system, l.branch_name, l.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get library systems (for grouping)
app.get('/api/library-systems', (req, res) => {
  const query = `
    SELECT DISTINCT library_system, 
           COUNT(*) as branch_count,
           COUNT(DISTINCT i.id) as total_images,
           COUNT(DISTINCT v.id) as total_visits
    FROM libraries l
    LEFT JOIN images i ON l.id = i.library_id
    LEFT JOIN visits v ON l.id = v.library_id
    WHERE library_system IS NOT NULL
    GROUP BY library_system
    ORDER BY library_system
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get branches by library system
app.get('/api/library-systems/:system/branches', (req, res) => {
  const systemName = req.params.system;
  
  const query = `
    SELECT l.*, 
           COUNT(DISTINCT i.id) as image_count,
           COUNT(DISTINCT v.id) as visit_count
    FROM libraries l
    LEFT JOIN images i ON l.id = i.library_id
    LEFT JOIN visits v ON l.id = v.library_id
    WHERE l.library_system = ?
    GROUP BY l.id
    ORDER BY l.branch_name, l.name
  `;
  
  db.all(query, [systemName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get library by ID
app.get('/api/libraries/:id', (req, res) => {
  const libraryId = req.params.id;
  
  db.get('SELECT * FROM libraries WHERE id = ?', [libraryId], (err, library) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!library) {
      res.status(404).json({ error: 'Library not found' });
      return;
    }
    res.json(library);
  });
});

// Add new library (now goes to pending for verification)
app.post('/api/libraries', (req, res) => {
  const { name, library_system, branch_name, address, city, county, zip_code, phone, website, latitude, longitude, submitted_by } = req.body;
  
  const query = `
    INSERT INTO pending_libraries (name, library_system, branch_name, address, city, county, zip_code, phone, website, latitude, longitude, submitted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [name, library_system, branch_name, address, city, county, zip_code, phone, website, latitude, longitude, submitted_by], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Library submitted for verification' });
  });
});

// Get pending libraries (admin only)
app.get('/api/admin/pending-libraries', (req, res) => {
  const query = `
    SELECT p.*, u.username as submitted_by_username, u.display_name as submitted_by_name
    FROM pending_libraries p
    JOIN users u ON p.submitted_by = u.id
    WHERE p.status = 'pending'
    ORDER BY p.submitted_at DESC
  `;
  
  db.all(query, [], (err, libraries) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(libraries);
  });
});

// Approve pending library
app.post('/api/admin/pending-libraries/:id/approve', (req, res) => {
  const { id } = req.params;
  const { reviewed_by, admin_notes } = req.body;
  
  // First, get the pending library details
  db.get('SELECT * FROM pending_libraries WHERE id = ?', [id], (err, pending) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!pending) {
      res.status(404).json({ error: 'Pending library not found' });
      return;
    }
    
    // Insert into main libraries table
    const insertQuery = `
      INSERT INTO libraries (name, library_system, branch_name, address, city, county, zip_code, phone, website, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertQuery, [
      pending.name, pending.library_system, pending.branch_name, pending.address, 
      pending.city, pending.county, pending.zip_code, pending.phone, pending.website, 
      pending.latitude, pending.longitude
    ], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update pending library status
      const updateQuery = `
        UPDATE pending_libraries 
        SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, admin_notes = ?
        WHERE id = ?
      `;
      
      db.run(updateQuery, [reviewed_by, admin_notes, id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Library approved and added successfully' });
      });
    });
  });
});

// Reject pending library
app.post('/api/admin/pending-libraries/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reviewed_by, admin_notes } = req.body;
  
  const query = `
    UPDATE pending_libraries 
    SET status = 'rejected', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, admin_notes = ?
    WHERE id = ?
  `;
  
  db.run(query, [reviewed_by, admin_notes, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Library rejected successfully' });
  });
});

// Get user's pending submissions
app.get('/api/users/:id/pending-libraries', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT * FROM pending_libraries 
    WHERE submitted_by = ?
    ORDER BY submitted_at DESC
  `;
  
  db.all(query, [userId], (err, libraries) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(libraries);
  });
});

// Check if user is admin
app.get('/api/users/:id/admin-status', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT role FROM admin_users 
    WHERE user_id = ?
  `;
  
  db.get(query, [userId], (err, admin) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ isAdmin: !!admin, role: admin?.role || null });
  });
});

// Toggle admin mode for a user
app.post('/api/users/:id/toggle-admin', (req, res) => {
  const userId = req.params.id;
  const { action, role = 'admin' } = req.body; // action: 'enable' or 'disable'
  
  if (action === 'enable') {
    // Check if user already has admin status
    db.get('SELECT * FROM admin_users WHERE user_id = ?', [userId], (err, existingAdmin) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (existingAdmin) {
        res.json({ message: 'User is already an admin', isAdmin: true, role: existingAdmin.role });
        return;
      }
      
      // Make user an admin
      db.run('INSERT INTO admin_users (user_id, role) VALUES (?, ?)', [userId, role], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Admin mode enabled', isAdmin: true, role });
      });
    });
  } else if (action === 'disable') {
    // Remove admin status
    db.run('DELETE FROM admin_users WHERE user_id = ?', [userId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes > 0) {
        res.json({ message: 'Admin mode disabled', isAdmin: false, role: null });
      } else {
        res.json({ message: 'User was not an admin', isAdmin: false, role: null });
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid action. Use "enable" or "disable"' });
  }
});

// Get all admin users (for admin management)
app.get('/api/admin/users', (req, res) => {
  const query = `
    SELECT a.*, u.username, u.display_name, u.email, u.created_at as user_created_at
    FROM admin_users a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `;
  
  db.all(query, [], (err, admins) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(admins);
  });
});

// Get images for a library
app.get('/api/libraries/:id/images', (req, res) => {
  const libraryId = req.params.id;
  
  db.all('SELECT * FROM images WHERE library_id = ? ORDER BY created_at DESC', [libraryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Upload image for a library
app.post('/api/libraries/:id/images', upload.single('image'), async (req, res) => {
  try {
    const libraryId = req.params.id;
    const { user_id, description, uploaded_by } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with Sharp
    const processedFilename = 'processed-' + req.file.filename;
    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(path.join(uploadsDir, processedFilename));

    // Delete original file
    fs.unlinkSync(req.file.path);

    // Save to database
    const query = `
      INSERT INTO images (library_id, user_id, filename, original_name, description, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [libraryId, user_id, processedFilename, req.file.originalname, description, uploaded_by], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update user's total images count
      if (user_id) {
        db.run('UPDATE users SET total_images = total_images + 1 WHERE id = ?', [user_id]);
      }
      
      res.json({ 
        id: this.lastID, 
        filename: processedFilename,
        message: 'Image uploaded successfully' 
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get visits for a library
app.get('/api/libraries/:id/visits', (req, res) => {
  const libraryId = req.params.id;
  
  db.all('SELECT * FROM visits WHERE library_id = ? ORDER BY visit_date DESC', [libraryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add visit to a library
app.post('/api/libraries/:id/visits', (req, res) => {
  const libraryId = req.params.id;
  const { user_id, visitor_name, notes, rating } = req.body;
  
  const query = `
    INSERT INTO visits (library_id, user_id, visitor_name, notes, rating)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [libraryId, user_id, visitor_name, notes, rating], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Update user's total visits count
    if (user_id) {
      db.run('UPDATE users SET total_visits = total_visits + 1 WHERE id = ?', [user_id]);
    }
    
    res.json({ id: this.lastID, message: 'Visit recorded successfully' });
  });
});

// Search libraries
app.get('/api/search', (req, res) => {
  const { q, county, library_system } = req.query;
  let query = `
    SELECT l.*, 
           COUNT(DISTINCT i.id) as image_count,
           COUNT(DISTINCT v.id) as visit_count
    FROM libraries l
    LEFT JOIN images i ON l.id = i.library_id
    LEFT JOIN visits v ON l.id = v.library_id
  `;
  
  const conditions = [];
  const params = [];
  
  if (q) {
    conditions.push('(l.name LIKE ? OR l.library_system LIKE ? OR l.branch_name LIKE ? OR l.city LIKE ? OR l.county LIKE ?)');
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  if (county) {
    conditions.push('l.county = ?');
    params.push(county);
  }
  
  if (library_system) {
    conditions.push('l.library_system = ?');
    params.push(library_system);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' GROUP BY l.id ORDER BY l.library_system, l.branch_name, l.name';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get counties for filter
app.get('/api/counties', (req, res) => {
  db.all('SELECT DISTINCT county FROM libraries WHERE county IS NOT NULL ORDER BY county', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.county));
  });
});

// User Authentication Routes

// Register new user
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, display_name } = req.body;
  
  // Simple password hashing (in production, use bcrypt)
  const password_hash = Buffer.from(password).toString('base64');
  
  const query = `
    INSERT INTO users (username, email, password_hash, display_name)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [username, email, password_hash, display_name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Username or email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.json({ id: this.lastID, message: 'User registered successfully' });
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const password_hash = Buffer.from(password).toString('base64');
  
  db.get('SELECT * FROM users WHERE username = ? AND password_hash = ?', 
    [username, password_hash], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Update last login
    db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        created_at: user.created_at,
        last_login: user.last_login,
        total_visits: user.total_visits,
        total_images: user.total_images
      },
      message: 'Login successful' 
    });
  });
});

// Get user profile
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  db.get('SELECT id, username, display_name, email, created_at, last_login, total_visits, total_images FROM users WHERE id = ?', 
    [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  });
});

// Get user's library visits
app.get('/api/users/:id/visits', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT v.*, l.name as library_name, l.library_system, l.branch_name, l.city, l.county
    FROM visits v
    JOIN libraries l ON v.library_id = l.id
    WHERE v.user_id = ?
    ORDER BY v.visit_date DESC
  `;
  
  db.all(query, [userId], (err, visits) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(visits);
  });
});

// Get user's uploaded images
app.get('/api/users/:id/images', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT i.*, l.name as library_name, l.library_system, l.branch_name, l.city, l.county
    FROM images i
    JOIN libraries l ON i.library_id = l.id
    WHERE i.user_id = ?
    ORDER BY i.created_at DESC
  `;
  
  db.all(query, [userId], (err, images) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(images);
  });
});

// Get user's library goals/checklist
app.get('/api/users/:id/goals', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT g.*, l.name as library_name, l.library_system, l.branch_name, l.city, l.county
    FROM user_library_goals g
    JOIN libraries l ON g.library_id = l.id
    WHERE g.user_id = ?
    ORDER BY g.created_at DESC
  `;
  
  db.all(query, [userId], (err, goals) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(goals);
  });
});

// Add library to user's goals
app.post('/api/users/:id/goals', (req, res) => {
  const userId = req.params.id;
  const { library_id, notes } = req.body;
  
  const query = `
    INSERT INTO user_library_goals (user_id, library_id, notes)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [userId, library_id, notes], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Library added to goals' });
  });
});

// Update goal status
app.put('/api/users/:id/goals/:goalId', (req, res) => {
  const { goalId } = req.params;
  const { status, notes } = req.body;
  
  let query = 'UPDATE user_library_goals SET status = ?';
  let params = [status];
  
  if (notes) {
    query += ', notes = ?';
    params.push(notes);
  }
  
  if (status === 'completed') {
    query += ', completed_at = CURRENT_TIMESTAMP';
  }
  
  query += ' WHERE id = ?';
  params.push(goalId);
  
  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Goal updated successfully' });
  });
});

// Get user statistics
app.get('/api/users/:id/stats', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM visits WHERE user_id = ?) as total_visits,
      (SELECT COUNT(*) FROM images WHERE user_id = ?) as total_images,
      (SELECT COUNT(*) FROM user_library_goals WHERE user_id = ? AND status = 'completed') as completed_goals,
      (SELECT COUNT(*) FROM user_library_goals WHERE user_id = ? AND status = 'pending') as pending_goals,
      (SELECT COUNT(DISTINCT library_id) FROM visits WHERE user_id = ?) as unique_libraries_visited,
      (SELECT COUNT(DISTINCT county) FROM visits v JOIN libraries l ON v.library_id = l.id WHERE v.user_id = ?) as counties_visited
  `;
  
  db.get(query, [userId, userId, userId, userId, userId, userId], (err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Library tracking app running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the app`);
}); 