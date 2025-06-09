import RSS from 'rss';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export async function getServerSideProps({ res }) {
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const data = await client.send(new ScanCommand({ TableName: process.env.POSTS_TABLE }));
  const feed = new RSS({
    title: 'Microblog RSS Feed',
    feed_url: `${process.env.BASE_URL}/rss`,
    site_url: process.env.BASE_URL
  });

  data.Items.forEach(item => {
    const post = unmarshall(item);
    feed.item({
      title: post.title,
      url: `${process.env.BASE_URL}/posts/${post.id}`,
      date: post.createdAt,
      description: post.content
    });
  });

  const xml = feed.xml({ indent: true });
  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function RSSPage() {
  return null;
}
