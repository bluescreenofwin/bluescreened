// pages/api/proxy-list.js
import { signAndFetch } from '../../lib/apiGatewayClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }
  try {
    const response = await signAndFetch('/posts', 'GET');
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy list error:', err);
    return res.status(500).json({ error: 'Failed to list posts' });
  }
}
