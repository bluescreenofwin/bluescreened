// Server-side only - use dynamic import in API routes
let fs, path;

if (typeof window === 'undefined') {
  fs = require('fs');
  path = require('path');
}

const LOG_FILE = typeof window === 'undefined' 
  ? path.join(process.cwd(), 'auth-log.txt')
  : null;
const LOG_EMAIL = 'logs@gsc.sh';

/**
 * Log authentication attempts to a text file (server-side only)
 * @param {string} username - The username/email attempting to log in
 * @param {boolean} success - Whether the login was successful
 * @param {string} error - Error message if login failed (optional)
 */
export function logAuthAttempt(username, success, error = null) {
  // Only run on server
  if (typeof window !== 'undefined' || !fs || !path) {
    console.warn('logAuthAttempt called on client side - skipping');
    return;
  }

  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILED';
  const errorMsg = error ? ` - Error: ${error}` : '';
  const logEntry = `[${timestamp}] ${status} - Username: ${username}${errorMsg}\n`;

  try {
    // Append to log file
    fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
    console.log(`Auth log entry written: ${logEntry.trim()}`);
  } catch (err) {
    console.error('Failed to write auth log:', err);
  }
}

/**
 * Read all log entries from the file (server-side only)
 * @returns {string} All log entries
 */
export function readAuthLogs() {
  // Only run on server
  if (typeof window !== 'undefined' || !fs || !path) {
    return '';
  }

  try {
    if (fs.existsSync(LOG_FILE)) {
      return fs.readFileSync(LOG_FILE, 'utf8');
    }
    return '';
  } catch (err) {
    console.error('Failed to read auth log:', err);
    return '';
  }
}

/**
 * Clear the log file (server-side only)
 */
export function clearAuthLogs() {
  // Only run on server
  if (typeof window !== 'undefined' || !fs || !path) {
    return;
  }

  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.unlinkSync(LOG_FILE);
    }
  } catch (err) {
    console.error('Failed to clear auth log:', err);
  }
}

/**
 * Get the email address for log reports
 * @returns {string} Email address
 */
export function getLogEmail() {
  return LOG_EMAIL;
}

