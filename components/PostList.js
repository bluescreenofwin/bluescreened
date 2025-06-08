import Link from 'next/link';

export default function PostList({ posts }) {
  return (
    <ul className="list-group">
      {posts.map((post) => (
        <li
          key={post.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <Link href={`/post/${post.id}`}>
            <a>{post.title}</a>
          </Link>
          <small className="text-muted">
            {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </li>
      ))}
    </ul>
  );
}
