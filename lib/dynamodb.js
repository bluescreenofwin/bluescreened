import DynamoDB from 'aws-sdk/clients/dynamodb';

const client = new DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.POSTS_TABLE;

export const getPosts = async () => {
  const params = { TableName: TABLE_NAME };
  const data = await client.scan(params).promise();
  return data.Items;
};

export const getPostById = async (id) => {
  const params = { TableName: TABLE_NAME, Key: { id } };
  const data = await client.get(params).promise();
  return data.Item;
};

export const createPost = async (post) => {
  const params = { TableName: TABLE_NAME, Item: post };
  await client.put(params).promise();
};

export const deletePost = async (id) => {
  const params = { TableName: TABLE_NAME, Key: { id } };
  await client.delete(params).promise();
};
