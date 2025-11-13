import Link from 'next/link';

export default function PostList({ posts = [] }) {
  if (!posts.length) {
    return <div className="text-muted">No posts yet.</div>;
  }

  return (
    <ul className="list-group">
      {posts.map((post) => (
        <li
          key={post.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <Link href={`/post/${post.id}`} className="text-decoration-none">
            {post.title}
          </Link>
          <small className="text-muted">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : '—'}
          </small>
        </li>
      ))}
    </ul>
  );
}
