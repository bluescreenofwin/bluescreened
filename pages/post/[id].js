import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: post, error } = useSWR(id ? `/api/posts/${id}` : null, fetcher);

  if (error) return <div className="text-danger">Failed to load post</div>;
  if (!post) return <div>Loading...</div>;

  const handleDelete = async () => {
    await invokeDeletePost(id);
    router.push('/');
  };

  return (
    <div className="container mt-4">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small className="text-muted d-block mb-3">
        {new Date(post.createdAt).toLocaleString()}
      </small>
      <div className="d-flex gap-2">
        <Link href="/"><a className="btn btn-secondary">Back</a></Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
}
