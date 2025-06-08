import { useState } from 'react';
import { useRouter } from 'next/router';
 import { invokeCreatePost } from '../lib/apiGatewayClient';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

 const res = await invokeCreatePost({ title, content });
    if (res.ok) router.push('/');
  };

  return (
    <div className="container mt-4">
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Post</button>
      </form>
    </div>
  );
}
