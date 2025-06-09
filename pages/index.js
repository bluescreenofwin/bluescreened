// pages/api/posts/index.js

import { signAndFetch } from '../../../lib/apiGatewayClient';

export default async function handler(req, res) {
  // Handle GET /api/posts
  if (req.method === 'GET') {
    try {
      const response = await signAndFetch('/posts', 'GET');
      const posts = await response.json();
      return res.status(200).json(posts);
    } catch (err) {
      console.error('Error proxying GET /posts:', err);
      return res.status(500).json({ error: 'Failed to load posts' });
    }
  }

  // Handle POST /api/posts
  if (req.method === 'POST') {
    const { title, content } = JSON.parse(req.body || '{}');
    if (!title || !content) {
      return res.status(400).json({ error: 'Missing title or content' });
    }
    try {
      const response = await signAndFetch('/posts', 'POST', { title, content });
      const created = await response.json();
      return res.status(response.status).json(created);
    } catch (err) {
      console.error('Error proxying POST /posts:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  // Method Not Allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
