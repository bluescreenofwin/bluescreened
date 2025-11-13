import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API, Auth } from 'aws-amplify';

import { GET_POST, DELETE_POST } from '../../lib/graphql';
import { ADMIN_GROUP, getReadAuthMode, isAdminUser } from '../../lib/amplifyHelpers';

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
      {loading && <div>Loading post…</div>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message || 'There was a problem loading this post.'}
        </div>
      )}
      {post && (
        <>
          <h1>{post.title}</h1>
          <p className="mt-3">{post.content}</p>
          <small className="text-muted d-block mb-4">
            Published {new Date(post.createdAt).toLocaleString()}
            {post.owner && (
              <>
                {' '}
                • <span>by {post.owner}</span>
              </>
            )}
          </small>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-secondary">
              Back
            </Link>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        </>
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
