# New Features Added

## 1. Auth Logging
- **Location**: `lib/authLogger.js`, `pages/api/auth-log.js`
- **Functionality**: Logs all login attempts (successful and failed) to `auth-log.txt`
- **Email**: Daily email reports sent to `logs@gsc.sh` at midnight UTC
- **Testing**: See `__tests__/authLogger.test.js`

### Configuration
Set environment variables for email:
- `SMTP_HOST` - SMTP server hostname
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_FROM` - From email address
- `CRON_SECRET` - Secret token for cron endpoint (optional)

## 2. Title Change
- Changed from "Microblog" to "Bluescreenofwin's Microblog"
- **Location**: `pages/index.js`

## 3. About Me Section
- **URL**: `/about`
- **Location**: `pages/about.js`
- Displays information about the blog and technologies used

## 4. Historical Section
- **URL**: `/historical`
- **Location**: `pages/historical.js`
- Groups and displays posts by year
- Shows all posts from each year in a card layout

## 5. View Tracker
- **Location**: `pages/api/increment-view.js`, `pages/post/[id].js`
- Tracks views for each post
- Displays view count at bottom of each post
- Uses in-memory tracking (for development) with database sync when possible
- **Note**: For production, consider implementing a Lambda resolver for public view increments

## Testing

Run tests with:
```bash
npm test
npm run test:watch
npm run test:coverage
```

Test files:
- `__tests__/authLogger.test.js` - Tests for auth logging
- `__tests__/emailService.test.js` - Tests for email functionality

## Daily Email Setup

For production deployment, set up a cron job or scheduled task to call:
```
POST /api/cron/daily-email
Header: x-cron-secret: <your-secret>
```

Or use AWS EventBridge/Lambda to schedule the daily email.

