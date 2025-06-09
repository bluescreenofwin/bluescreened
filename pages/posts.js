import { useEffect, useState } from 'react';
import { Amplify, Auth, API } from 'aws-amplify';

Amplify.configure({
  Auth: {},
  API: {
    endpoints: [
      {
        name: 'PostsAPI',
        endpoint: process.env.NEXT_PUBLIC_API_URL,
        service: 'execute-api'
      }
    ]
  }
});

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      await Auth.currentCredentials();
      const data = await API.get('PostsAPI', '/posts');
      setPosts(data);
    })();
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
