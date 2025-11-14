import { sendAuthLogReport } from '../../../lib/emailService';

// This endpoint should be called by a cron job or scheduled task
// For AWS Amplify, you can use AWS EventBridge or a Lambda function
// For local testing, you can call this endpoint manually

export default async function handler(req, res) {
  // Optional: Add authentication/authorization check here
  // For example, check for a secret token in headers
  const authToken = req.headers['x-cron-secret'];
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authToken !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await sendAuthLogReport();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Daily auth log email sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send email',
      });
    }
  } catch (error) {
    console.error('Error in daily email cron job:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

