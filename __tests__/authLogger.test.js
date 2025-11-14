// Mock fs and path before importing
jest.mock('fs');
const path = require('path');
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

const fs = require('fs');
const { logAuthAttempt, readAuthLogs, clearAuthLogs, getLogEmail } = require('../lib/authLogger');

describe('Auth Logger', () => {
  const LOG_FILE = 'auth-log.txt';

  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(false);
    fs.appendFileSync.mockImplementation(() => {});
    fs.readFileSync.mockReturnValue('');
  });

  describe('logAuthAttempt', () => {
    it('should log successful authentication attempt', () => {
      logAuthAttempt('test@example.com', true);
      
      expect(fs.appendFileSync).toHaveBeenCalled();
      const callArgs = fs.appendFileSync.mock.calls[0];
      expect(callArgs[1]).toContain('SUCCESS');
      expect(callArgs[1]).toContain('test@example.com');
      expect(callArgs[2]).toBe('utf8');
    });

    it('should log failed authentication attempt with error', () => {
      logAuthAttempt('test@example.com', false, 'Invalid password');
      
      expect(fs.appendFileSync).toHaveBeenCalled();
      const callArgs = fs.appendFileSync.mock.calls[0];
      expect(callArgs[1]).toContain('FAILED');
      expect(callArgs[1]).toContain('Invalid password');
      expect(callArgs[2]).toBe('utf8');
    });

    it('should include timestamp in log entry', () => {
      const before = new Date().toISOString();
      logAuthAttempt('test@example.com', true);
      const after = new Date().toISOString();
      
      const callArgs = fs.appendFileSync.mock.calls[0];
      const logEntry = callArgs[1];
      
      // Extract timestamp from log entry
      const timestampMatch = logEntry.match(/\[(.*?)\]/);
      expect(timestampMatch).toBeTruthy();
      
      const timestamp = timestampMatch[1];
      expect(new Date(timestamp).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
      expect(new Date(timestamp).getTime()).toBeLessThanOrEqual(new Date(after).getTime());
    });
  });

  describe('readAuthLogs', () => {
    it('should read logs from file when file exists', () => {
      const mockLogs = '[2025-01-01T00:00:00.000Z] SUCCESS - Username: test@example.com\n';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockLogs);

      const logs = readAuthLogs();
      
      expect(fs.readFileSync).toHaveBeenCalled();
      const callArgs = fs.readFileSync.mock.calls[0];
      expect(callArgs[1]).toBe('utf8');
      expect(logs).toBe(mockLogs);
    });

    it('should return empty string when file does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const logs = readAuthLogs();
      
      expect(logs).toBe('');
    });
  });

  describe('clearAuthLogs', () => {
    it('should delete log file when it exists', () => {
      fs.existsSync.mockReturnValue(true);

      clearAuthLogs();
      
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should not throw error when file does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => clearAuthLogs()).not.toThrow();
    });
  });

  describe('getLogEmail', () => {
    it('should return the correct email address', () => {
      const email = getLogEmail();
      expect(email).toBe('logs@gsc.sh');
    });
  });
});

