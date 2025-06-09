// pages/api/proxy-delete.js
import { signAndFetch } from '../../lib/apiGatewayClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end();
  }
  const { id } = req.query;
  try {
    const response = await signAndFetch(`/posts/${id}`, 'DELETE');
    return res.status(response.status).end();
  } catch (err) {
    console.error('Proxy delete error:', err);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
}
