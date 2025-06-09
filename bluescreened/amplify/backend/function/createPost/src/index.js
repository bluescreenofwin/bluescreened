import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  const { title, content } = JSON.parse(event.body);
  const item = { id: uuidv4(), title, content, createdAt: new Date().toISOString() };
  await client.send(new PutItemCommand({ TableName: process.env.POSTS_TABLE, Item: marshall(item) }));
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  };
};
