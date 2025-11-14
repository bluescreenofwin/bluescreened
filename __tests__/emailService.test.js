// Mock modules before importing
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(),
}));

jest.mock('../lib/authLogger', () => ({
  readAuthLogs: jest.fn(),
  getLogEmail: jest.fn(() => 'logs@gsc.sh'),
}));

const nodemailer = require('nodemailer');
const { sendAuthLogReport, getEmailConfigStatus } = require('../lib/emailService');
const { readAuthLogs, getLogEmail } = require('../lib/authLogger');

describe('Email Service', () => {
  let mockTransporter;
  let mockSendMail;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockTransporter = {
      sendMail: mockSendMail,
    };
    nodemailer.createTransporter.mockReturnValue(mockTransporter);
  });

  describe('sendAuthLogReport', () => {
    it('should send email with auth logs', async () => {
      const mockLogs = '[2025-01-01T00:00:00.000Z] SUCCESS - Username: test@example.com\n';
      readAuthLogs.mockReturnValue(mockLogs);
      getLogEmail.mockReturnValue('logs@gsc.sh');

      const result = await sendAuthLogReport();

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'logs@gsc.sh',
          subject: 'Daily Auth Log Report - Microblog',
          text: expect.stringContaining(mockLogs),
          html: expect.stringContaining(mockLogs),
        })
      );
    });

    it('should return success message when no logs exist', async () => {
      readAuthLogs.mockReturnValue('');

      const result = await sendAuthLogReport();

      expect(result.success).toBe(true);
      expect(result.message).toBe('No logs to send');
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should handle email send errors', async () => {
      const mockLogs = '[2025-01-01T00:00:00.000Z] SUCCESS - Username: test@example.com\n';
      readAuthLogs.mockReturnValue(mockLogs);
      getLogEmail.mockReturnValue('logs@gsc.sh');
      mockSendMail.mockRejectedValue(new Error('SMTP error'));

      const result = await sendAuthLogReport();

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP error');
    });

    it('should include timestamp in email', async () => {
      const mockLogs = '[2025-01-01T00:00:00.000Z] SUCCESS - Username: test@example.com\n';
      readAuthLogs.mockReturnValue(mockLogs);
      getLogEmail.mockReturnValue('logs@gsc.sh');

      await sendAuthLogReport();

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('Generated at');
    });
  });

  describe('getEmailConfigStatus', () => {
    it('should return configuration status object', () => {
      const status = getEmailConfigStatus();
      
      // Verify it returns an object with expected properties
      expect(status).toBeDefined();
      expect(status).toHaveProperty('email');
      expect(status.email).toBe('logs@gsc.sh');
      // configured and smtpConfigured depend on environment variables
      expect(status).toHaveProperty('configured');
      expect(status).toHaveProperty('smtpConfigured');
    });
  });
});

