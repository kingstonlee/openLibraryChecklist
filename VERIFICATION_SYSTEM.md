# Library Verification System

## Overview

The library tracking app now includes a comprehensive verification system for user-submitted libraries. This ensures data quality and prevents spam or inaccurate submissions while maintaining the crowdsourced nature of the platform.

## How It Works

### 1. User Submission Process
- When users add a new library, it goes to a **pending** status instead of being immediately added
- Users receive a confirmation message: "Library submitted for verification"
- The submission includes the user's ID for tracking and accountability

### 2. Admin Review Process
- **Admin users** can review pending submissions through the admin panel
- Each submission shows:
  - Library details (name, system, branch, address, etc.)
  - Submitter information
  - Submission date
  - Review actions (Approve/Reject)

### 3. Approval/Rejection Workflow
- **Approve**: Library is moved from `pending_libraries` to the main `libraries` table
- **Reject**: Library remains in `pending_libraries` with "rejected" status
- Both actions include admin notes and tracking information

## Database Schema

### New Tables Added

#### `pending_libraries`
```sql
CREATE TABLE pending_libraries (
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
);
```

#### `admin_users`
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  role TEXT DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## API Endpoints

### User Submission
- `POST /api/libraries` - Submit new library for verification
- `GET /api/users/:id/pending-libraries` - Get user's pending submissions

### Admin Management
- `GET /api/admin/pending-libraries` - Get all pending libraries
- `POST /api/admin/pending-libraries/:id/approve` - Approve a library
- `POST /api/admin/pending-libraries/:id/reject` - Reject a library
- `GET /api/users/:id/admin-status` - Check if user is admin

## Admin Setup

### Creating Admin Users
Use the admin setup script:

```bash
# Make a user an admin
node scripts/setup-admin.js add <username> admin

# Make a user a moderator
node scripts/setup-admin.js add <username> moderator

# List all admin users
node scripts/setup-admin.js list

# Remove admin status
node scripts/setup-admin.js remove <username>
```

### Admin Roles
- **Admin**: Full access to approve/reject libraries
- **Moderator**: Same permissions as admin (can be extended for different levels)

## Frontend Features

### User Experience
- **Submission Feedback**: Clear messaging about verification status
- **Pending Submissions**: Users can see their submitted libraries and their status
- **Status Tracking**: Visual indicators for pending, approved, and rejected submissions

### Admin Interface
- **Admin Panel**: Accessible from user profile for admin users
- **Review Interface**: Clean, organized view of pending submissions
- **Quick Actions**: One-click approve/reject with optional notes
- **Real-time Updates**: Lists refresh automatically after actions

## User Interface Elements

### User Profile Additions
- **Admin Panel Section**: Shows for admin users with pending count
- **Pending Submissions Section**: Shows user's submitted libraries with status

### Admin Modal
- **Library Details**: Complete information about each submission
- **Submitter Info**: Who submitted and when
- **Action Buttons**: Approve/Reject with confirmation

### Status Indicators
- **Pending**: Orange border and badge
- **Approved**: Green border and badge  
- **Rejected**: Red border and badge

## Benefits

### Data Quality
- **Verification**: Ensures accurate library information
- **Spam Prevention**: Prevents malicious or duplicate submissions
- **Consistency**: Maintains standardized data format

### User Engagement
- **Transparency**: Users can track their submissions
- **Accountability**: Submissions are linked to user accounts
- **Feedback**: Clear status updates and admin notes

### Scalability
- **Moderator System**: Can add multiple admins/moderators
- **Audit Trail**: Complete history of submissions and reviews
- **Flexible Roles**: Different permission levels possible

## Usage Examples

### For Regular Users
1. **Submit Library**: Fill out library form → Gets "submitted for verification" message
2. **Track Status**: Check user profile → See pending submissions with status
3. **Get Notified**: Admin actions update submission status

### For Admins
1. **Access Panel**: Login → User profile → Admin panel button
2. **Review Submissions**: See list of pending libraries with details
3. **Take Action**: Click approve/reject → Add optional notes
4. **Monitor**: Track approved/rejected libraries

## Security Considerations

- **Admin Verification**: Only verified admin users can approve/reject
- **Audit Trail**: All actions are logged with admin ID and timestamp
- **Data Integrity**: Foreign key constraints ensure data consistency
- **User Accountability**: Submissions are linked to user accounts

## Future Enhancements

### Potential Features
- **Email Notifications**: Notify users when submissions are reviewed
- **Bulk Actions**: Approve/reject multiple libraries at once
- **Advanced Filtering**: Filter pending libraries by various criteria
- **Submission Guidelines**: Help users submit better quality data
- **Auto-approval**: Automatically approve submissions from trusted users
- **Review Queue**: Prioritize submissions based on various factors

### Integration Possibilities
- **External APIs**: Verify library information against official databases
- **Geolocation**: Auto-populate coordinates for address validation
- **Duplicate Detection**: Check for similar existing libraries
- **Quality Scoring**: Rate submission quality for better review prioritization

## Troubleshooting

### Common Issues
1. **Admin Access Denied**: Ensure user is properly set up as admin
2. **Pending Libraries Not Showing**: Check if user has admin status
3. **Submission Not Appearing**: Verify submission was successful
4. **Approval Fails**: Check database permissions and constraints

### Debug Commands
```bash
# Check admin status
curl http://localhost:3000/api/users/1/admin-status

# List pending libraries
curl http://localhost:3000/api/admin/pending-libraries

# Test submission
curl -X POST http://localhost:3000/api/libraries -H "Content-Type: application/json" -d '{"name":"Test","submitted_by":1}'
```

This verification system ensures the library database maintains high quality while encouraging community participation in expanding the library coverage. 