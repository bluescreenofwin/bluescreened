import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API } from 'aws-amplify';

import PostList from '../components/PostList';
import { LIST_POSTS } from '../lib/graphql';
import { getReadAuthMode } from '../lib/amplifyHelpers';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const authMode = getReadAuthMode();
        
        // Validate configuration before making the request
        if (!authMode) {
          throw new Error('Amplify configuration is missing. Please check your .env.local file.');
        }

        console.log('Loading posts with auth mode:', authMode);

        const { data } = await API.graphql({
          query: LIST_POSTS,
          authMode: authMode,
        });

        const items = data?.listPosts?.items ?? [];
        const sorted = [...items].sort(
          (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
        setPosts(sorted);
      } catch (err) {
        console.error('Failed to load posts', err);
        // Extract more detailed error message
        const errorMessage = err?.errors?.[0]?.message || 
                            err?.message || 
                            err?.error?.message ||
                            'Failed to load posts';
        setError(new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1 className="display-4 fw-bold">Microblog</h1>
        <p className="lead text-muted">Latest posts from the community</p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading posts…</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error.message || 'Failed to load posts'}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      {!loading && !error && <PostList posts={posts} />}
    </div>
  );
}
