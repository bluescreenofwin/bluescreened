import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API } from 'aws-amplify';

import { LIST_POSTS } from '../lib/graphql';
import { getReadAuthMode } from '../lib/amplifyHelpers';

export default function Historical() {
  const [postsByYear, setPostsByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const authMode = getReadAuthMode();
        
        if (!authMode) {
          throw new Error('Amplify configuration is missing.');
        }

        const { data } = await API.graphql({
          query: LIST_POSTS,
          authMode: authMode,
        });

        const items = data?.listPosts?.items ?? [];
        
        // Group posts by year
        const grouped = items.reduce((acc, post) => {
          if (!post.createdAt) return acc;
          const year = new Date(post.createdAt).getFullYear();
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(post);
          return acc;
        }, {});

        // Sort years in descending order
        const sortedYears = Object.keys(grouped).sort((a, b) => b - a);
        const sortedGrouped = {};
        sortedYears.forEach(year => {
          sortedGrouped[year] = grouped[year].sort(
            (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
          );
        });

        setPostsByYear(sortedGrouped);
      } catch (err) {
        console.error('Failed to load posts', err);
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
        <Link href="/" className="text-decoration-none text-muted mb-3 d-inline-block">
          ← Back to posts
        </Link>
        <h1 className="display-4 fw-bold mb-3">Historical Posts</h1>
        <p className="lead text-muted">Browse posts by year</p>
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

      {!loading && !error && (
        <div className="row">
          {Object.keys(postsByYear).length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <p className="text-muted">No posts found.</p>
              </div>
            </div>
          ) : (
            Object.entries(postsByYear).map(([year, posts]) => (
              <div key={year} className="col-12 mb-5">
                <h2 className="h3 mb-4 border-bottom pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-calendar3 me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                    <path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                  {year}
                </h2>
                <div className="row g-4">
                  {posts.map((post) => (
                    <div key={post.id} className="col-md-6">
                      <div className="card shadow-sm h-100">
                        <div className="card-body">
                          <Link
                            href={`/post/${post.id}`}
                            className="text-decoration-none text-dark"
                          >
                            <h5 className="card-title mb-3">{post.title}</h5>
                          </Link>
                          {post.content && (
                            <p className="card-text text-muted">
                              {post.content.length > 100
                                ? `${post.content.substring(0, 100)}...`
                                : post.content}
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </small>
                            <Link
                              href={`/post/${post.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Read more →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

