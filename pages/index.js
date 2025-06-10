import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import Link from 'next/link';

export async function getStaticProps() {
  const client = new DynamoDBClient({ region: process.env.REGION });
  const data = await client.send(new ScanCommand({
    TableName: process.env.POSTS_TABLE,
    Limit: 5
  }));
  const posts = data.Items.map(item => unmarshall(item));
  return { props: { posts } };
}

export default function Home({ posts }) {
  return (
    <div>
      <h1>Featured Posts</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}><Link href={`/posts/${p.id}`}>{p.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
