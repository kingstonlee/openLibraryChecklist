const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'library.db');
const db = new sqlite3.Database(dbPath);

console.log('Setting up admin user...');

// Function to create admin user
function setupAdmin(username, role = 'admin') {
  return new Promise((resolve, reject) => {
    // First, find the user by username
    db.get('SELECT id, username, display_name FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!user) {
        reject(new Error(`User '${username}' not found. Please register the user first.`));
        return;
      }
      
      console.log(`Found user: ${user.username} (${user.display_name})`);
      
      // Check if user is already an admin
      db.get('SELECT * FROM admin_users WHERE user_id = ?', [user.id], (err, existingAdmin) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (existingAdmin) {
          console.log(`User '${username}' is already an admin with role: ${existingAdmin.role}`);
          resolve(existingAdmin);
          return;
        }
        
        // Make user an admin
        db.run('INSERT INTO admin_users (user_id, role) VALUES (?, ?)', [user.id, role], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          console.log(`✅ Successfully made '${username}' an ${role}!`);
          resolve({ id: this.lastID, user_id: user.id, role });
        });
      });
    });
  });
}

// Function to list all admin users
function listAdmins() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.*, u.username, u.display_name, u.email
      FROM admin_users a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;
    
    db.all(query, [], (err, admins) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('\n📋 Current Admin Users:');
      if (admins.length === 0) {
        console.log('No admin users found.');
      } else {
        admins.forEach(admin => {
          console.log(`• ${admin.username} (${admin.display_name}) - ${admin.role} - Created: ${admin.created_at}`);
        });
      }
      resolve(admins);
    });
  });
}

// Function to remove admin status
function removeAdmin(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!user) {
        reject(new Error(`User '${username}' not found.`));
        return;
      }
      
      db.run('DELETE FROM admin_users WHERE user_id = ?', [user.id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes > 0) {
          console.log(`✅ Removed admin status from '${username}'`);
        } else {
          console.log(`User '${username}' was not an admin`);
        }
        resolve({ changes: this.changes });
      });
    });
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'add':
        const username = args[1];
        const role = args[2] || 'admin';
        
        if (!username) {
          console.log('Usage: node setup-admin.js add <username> [role]');
          console.log('Roles: admin, moderator');
          process.exit(1);
        }
        
        await setupAdmin(username, role);
        break;
        
      case 'list':
        await listAdmins();
        break;
        
      case 'remove':
        const userToRemove = args[1];
        
        if (!userToRemove) {
          console.log('Usage: node setup-admin.js remove <username>');
          process.exit(1);
        }
        
        await removeAdmin(userToRemove);
        break;
        
      default:
        console.log('Library Admin Setup Tool');
        console.log('');
        console.log('Usage:');
        console.log('  node setup-admin.js add <username> [role]    - Make user an admin');
        console.log('  node setup-admin.js list                    - List all admin users');
        console.log('  node setup-admin.js remove <username>       - Remove admin status');
        console.log('');
        console.log('Examples:');
        console.log('  node setup-admin.js add testuser admin');
        console.log('  node setup-admin.js add moderator1 moderator');
        console.log('  node setup-admin.js list');
        console.log('  node setup-admin.js remove testuser');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run the script
main(); 