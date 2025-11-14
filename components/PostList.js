import Link from 'next/link';

export default function PostList({ posts = [] }) {
  if (!posts.length) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-journal-text text-muted mb-3"
            viewBox="0 0 16 16"
          >
            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 1-1-1V2a2 2 0 0 1 2-2z" />
          </svg>
          <p className="mt-2">No posts yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {posts.map((post) => (
        <div key={post.id} className="col-12">
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
                  {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
                </p>
              )}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
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
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
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
  );
}
