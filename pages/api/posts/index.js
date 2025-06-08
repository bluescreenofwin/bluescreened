import { v4 as uuidv4 } from 'uuid';
import { getPosts, createPost } from '../../../lib/dynamodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = await getPosts();
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { title, content } = JSON.parse(req.body);
    if (!title || !content) {
      return res.status(400).json({ error: 'Missing title or content' });
    }
    const post = { id: uuidv4(), title, content, createdAt: new Date().toISOString() };
    await createPost(post);
    return res.status(201).json(post);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
