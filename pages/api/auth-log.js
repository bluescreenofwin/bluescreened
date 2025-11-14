import { logAuthAttempt, readAuthLogs, clearAuthLogs } from '../../lib/authLogger';

export default async function handler(req, res) {
  // Only allow POST requests for logging
  if (req.method === 'POST') {
    const { username, success, error } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    logAuthAttempt(username, success, error);
    return res.status(200).json({ message: 'Log entry created' });
  }

  // GET request to read logs (for testing/admin purposes)
  if (req.method === 'GET') {
    const logs = readAuthLogs();
    return res.status(200).json({ logs });
  }

  // DELETE request to clear logs (for testing)
  if (req.method === 'DELETE') {
    clearAuthLogs();
    return res.status(200).json({ message: 'Logs cleared' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

