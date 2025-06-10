import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event) => {
  const id = event.pathParameters.id;
  const res = await client.send(new GetItemCommand({
    TableName: process.env.POSTS_TABLE,
    Key: { id: { S: id } }
  }));
  if (!res.Item) {
    return { statusCode: 404, body: "Not found" };
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unmarshall(res.Item))
  };
};
