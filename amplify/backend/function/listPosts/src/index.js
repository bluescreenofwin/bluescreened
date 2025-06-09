import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler = async () => {
  const data = await client.send(new ScanCommand({ TableName: process.env.POSTS_TABLE }));
  const items = data.Items.map(item => unmarshall(item));
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  };
};
