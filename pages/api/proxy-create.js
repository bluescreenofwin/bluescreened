// pages/api/proxy-create.js
import { signAndFetch } from '../../lib/apiGatewayClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }
  try {
    const body = JSON.parse(req.body || '{}');
    const response = await signAndFetch('/posts', 'POST', body);
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (err) {
    console.error('Proxy create error:', err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}
