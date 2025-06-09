// pages/index.js

import Link from 'next/link';
import useSWR from 'swr';
import PostList from '../components/PostList';

// 1) Throw on non-2xx so SWR picks it up as `error`
const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    // try to parse body for error message
    let errMsg = `${res.status} ${res.statusText}`;
    try {
      const errorBody = await res.json();
      errMsg = errorBody.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
};

export default function Home() {
  const { data: posts, error, isLoading } = useSWR('/api/proxy-list', fetcher);

  if (error) return <div className="text-danger">Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

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
