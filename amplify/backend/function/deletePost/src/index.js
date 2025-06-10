import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event) => {
  const id = event.pathParameters.id;
  await client.send(new DeleteItemCommand({ TableName: process.env.POSTS_TABLE, Key: { id: { S: id } } }));
  return { statusCode: 204 };
};
