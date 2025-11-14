import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API, Auth } from 'aws-amplify';

import { GET_POST, DELETE_POST } from '../../lib/graphql';
import { ADMIN_GROUP, getReadAuthMode, isAdminUser } from '../../lib/amplifyHelpers';

// Track post view
const trackView = async (postId) => {
  try {
    const response = await fetch('/api/increment-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Failed to track view:', error);
  }
  return null;
};

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const { data } = await API.graphql({
          query: GET_POST,
          variables: { id },
          authMode: getReadAuthMode(),
        });

        if (!data?.getPost) {
          setError(new Error('Post not found'));
          return;
        }

        setPost(data.getPost);
        
        // Track view when post is loaded
        if (data.getPost) {
          trackView(id).then((result) => {
            // Update view count if tracking was successful
            if (result?.viewCount !== undefined) {
              setPost(prev => ({ ...prev, viewCount: result.viewCount }));
            }
          });
        }
      } catch (err) {
        console.error('Failed to load post', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };

    loadUser();
  }, []);

  const handleDelete = async () => {
    if (!post?.id) return;
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      await API.graphql({
        query: DELETE_POST,
        variables: { input: { id: post.id } },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      router.push('/');
    } catch (err) {
      console.error('Failed to delete post', err);
      setError(err);
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = !!(post && currentUser && isAdminUser(currentUser));

  return (
    <div className="container mt-4">
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading post…</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error.message || 'There was a problem loading this post.'}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      {post && (
        <article>
          <div className="mb-4">
            <Link href="/" className="text-decoration-none text-muted mb-3 d-inline-block">
              ← Back to posts
            </Link>
            <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
            <div className="text-muted mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar3 me-1"
                viewBox="0 0 16 16"
              >
                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                <path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
              Published {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
              {post.owner && (
                <>
                  {' • '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person me-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  by {post.owner}
                </>
              )}
            </div>
          </div>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="post-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {post.content}
              </div>
            </div>
          </div>
          <div className="text-muted text-center mb-4">
            <small>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye me-1"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              {post.viewCount || 0} {post.viewCount === 1 ? 'view' : 'views'}
            </small>
          </div>
          {canDelete && (
            <div className="d-flex gap-2">
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting…
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash me-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                    </svg>
                    Delete Post
                  </>
                )}
              </button>
            </div>
          )}
        </article>
      )}
      {!currentUser && (
        <div className="alert alert-info mt-4" role="alert">
          Sign in from the{' '}
          <Link href="/new" className="link-primary">
            new post page
          </Link>{' '}
          as a member of the <code>{ADMIN_GROUP}</code> group to manage posts.
        </div>
      )}
      {currentUser && !canDelete && (
        <div className="alert alert-warning mt-4" role="alert">
          You are signed in but not authorized to delete posts. Add the{' '}
          <code>{ADMIN_GROUP}</code> group to your user in Cognito.
        </div>
      )}
    </div>
  );
}
