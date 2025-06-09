// pages/index.js

import Link from 'next/link';
import useSWR from 'swr';
import PostList from '../components/PostList';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: posts, error } = useSWR('/api/proxy-list', fetcher);

  if (error)  return <div className="text-danger">Failed to load posts</div>;
  if (!posts) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Microblog</h1>
        <Link href="/new">
          <a className="btn btn-primary">New Post</a>
        </Link>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
