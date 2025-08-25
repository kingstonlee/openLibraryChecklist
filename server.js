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
  // Libraries table
  db.run(`CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
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
    filename TEXT NOT NULL,
    original_name TEXT,
    description TEXT,
    uploaded_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (library_id) REFERENCES libraries (id)
  )`);

  // Visits table for tracking
  db.run(`CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    library_id INTEGER,
    visitor_name TEXT,
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (library_id) REFERENCES libraries (id)
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
    ORDER BY l.name
  `;
  
  db.all(query, [], (err, rows) => {
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

// Add new library
app.post('/api/libraries', (req, res) => {
  const { name, address, city, county, zip_code, phone, website, latitude, longitude } = req.body;
  
  const query = `
    INSERT INTO libraries (name, address, city, county, zip_code, phone, website, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [name, address, city, county, zip_code, phone, website, latitude, longitude], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Library added successfully' });
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
    const { description, uploaded_by } = req.body;
    
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
      INSERT INTO images (library_id, filename, original_name, description, uploaded_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [libraryId, processedFilename, req.file.originalname, description, uploaded_by], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
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
  const { visitor_name, notes } = req.body;
  
  const query = `
    INSERT INTO visits (library_id, visitor_name, notes)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [libraryId, visitor_name, notes], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Visit recorded successfully' });
  });
});

// Search libraries
app.get('/api/search', (req, res) => {
  const { q, county } = req.query;
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
    conditions.push('(l.name LIKE ? OR l.city LIKE ? OR l.county LIKE ?)');
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (county) {
    conditions.push('l.county = ?');
    params.push(county);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' GROUP BY l.id ORDER BY l.name';
  
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