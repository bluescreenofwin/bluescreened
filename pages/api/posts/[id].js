import { getPostById, deletePost } from '../../../lib/dynamodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'DELETE') {
    await deletePost(id);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
