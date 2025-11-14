import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import { CREATE_POST } from '../lib/graphql';
import { ADMIN_GROUP, isAdminUser } from '../lib/amplifyHelpers';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // Track authentication events
  useEffect(() => {
    const trackAuth = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          // Log successful authentication
          await fetch('/api/auth-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user.username || user.attributes?.email || 'unknown',
              success: true,
            }),
          });
        }
      } catch (error) {
        // Not authenticated - this is expected before login
      }
    };

    // Listen for auth state changes
    const unsubscribe = Auth.Hub.listen('auth', async (data) => {
      if (data.payload.event === 'signIn') {
        const user = data.payload.data;
        await fetch('/api/auth-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username || user.attributes?.email || 'unknown',
            success: true,
          }),
        });
      } else if (data.payload.event === 'signIn_failure') {
        const error = data.payload.data;
        await fetch('/api/auth-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: error.username || 'unknown',
            success: false,
            error: error.message || 'Authentication failed',
          }),
        });
      }
    });

    trackAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Authenticator
      services={{
        async handleSignIn(formData) {
          const { username, password } = formData;
          try {
            const user = await Auth.signIn(username, password);
            // Log successful login
            await fetch('/api/auth-log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: username,
                success: true,
              }),
            });
            return user;
          } catch (error) {
            // Log failed login
            await fetch('/api/auth-log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: username,
                success: false,
                error: error.message || 'Authentication failed',
              }),
            });
            throw error;
          }
        },
      }}
    >
      {({ signOut, user }) => {
        const isAdmin = isAdminUser(user);

        const handleSubmit = async (e) => {
          e.preventDefault();
          setError(null);
          setSaving(true);

          try {
            await API.graphql({
              query: CREATE_POST,
              variables: {
                input: {
                  title,
                  content,
                  owner: user?.username ?? 'unknown',
                },
              },
              authMode: 'AMAZON_COGNITO_USER_POOLS',
            });

            router.push('/');
          } catch (err) {
            console.error('Failed to create post', err);
            setError(err);
          } finally {
            setSaving(false);
          }
        };

        return (
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1>New Post</h1>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">{user?.username}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </div>

            {!isAdmin ? (
              <div className="alert alert-warning" role="alert">
                You are signed in but not authorized to write posts. Add yourself to the{' '}
                <code>{ADMIN_GROUP}</code> Cognito user group to continue.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    minLength={10}
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error.message || 'There was a problem creating the post.'}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Posting…' : 'Post'}
                </button>
              </form>
            )}
          </div>
        );
      }}
    </Authenticator>
  );
}
