/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MICROBLOGTABLE_ARN
	STORAGE_MICROBLOGTABLE_NAME
	STORAGE_MICROBLOGTABLE_STREAMARN
Amplify Params - DO NOT EDIT */import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event) => {
  const id = event.pathParameters.id;
  await client.send(new DeleteItemCommand({ TableName: process.env.POSTS_TABLE, Key: { id: { S: id } } }));
  return { statusCode: 204 };
};
