// lib/dynamodb.js
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE = process.env.POSTS_TABLE;

export const getPosts = async () => {
  const { Items } = await client.send(new ScanCommand({ TableName: TABLE }));
  return Items;
};

export const getPostById = async (id) => {
  const { Item } = await client.send(new GetItemCommand({
    TableName: TABLE,
    Key: { id: { S: id } }
  }));
  return Item;
};

export const createPost = async (post) => {
  await client.send(new PutItemCommand({
    TableName: TABLE,
    Item: {
      id:       { S: post.id },
      title:    { S: post.title },
      content:  { S: post.content },
      createdAt:{ S: post.createdAt }
    }
  }));
};

export const deletePost = async (id) => {
  await client.send(new DeleteItemCommand({
    TableName: TABLE,
    Key: { id: { S: id } }
  }));
};
