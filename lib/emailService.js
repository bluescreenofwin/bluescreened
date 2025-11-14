import nodemailer from 'nodemailer';
import { readAuthLogs, getLogEmail } from './authLogger';

// Configure email transporter
// For production, use AWS SES or another email service
// For testing, you can use a service like Ethereal Email or Gmail SMTP
const createTransporter = () => {
  // Check for SMTP configuration in environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Default: Use Ethereal Email for testing (creates a fake SMTP server)
  // In production, configure real SMTP credentials
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER || 'test@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'test',
    },
  });
};

/**
 * Send auth log report via email
 * @returns {Promise<Object>} Email send result
 */
export async function sendAuthLogReport() {
  try {
    const logs = readAuthLogs();
    const logEmail = getLogEmail();

    if (!logs || logs.trim().length === 0) {
      console.log('No logs to send');
      return { success: true, message: 'No logs to send' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@microblog.app',
      to: logEmail,
      subject: 'Daily Auth Log Report - Microblog',
      text: `Daily Authentication Log Report\n\n${logs}`,
      html: `
        <h2>Daily Authentication Log Report</h2>
        <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${logs}</pre>
        <p><small>Generated at ${new Date().toISOString()}</small></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Auth log email sent:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send auth log email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get email configuration status
 * @returns {Object} Configuration status
 */
export function getEmailConfigStatus() {
  const hasSmtpConfig =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  return {
    configured: hasSmtpConfig,
    email: getLogEmail(),
    smtpConfigured: hasSmtpConfig,
  };
}

