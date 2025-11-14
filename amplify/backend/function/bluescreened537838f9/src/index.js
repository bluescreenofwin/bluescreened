const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Lambda function to increment post view count
 * This function can be called publicly without authentication
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const postId = event.arguments?.postId || event.postId;

  if (!postId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Post ID is required' }),
    };
  }

  try {
    // Get the table name from various sources
    const tableName = 
      process.env.POST_TABLE_NAME || 
      process.env.API_BLUESCREENED_POSTTABLE_NAME ||
      // Known table name from deployment
      'Post-kjn5z4i35rfghk3smjksxj23py-microblog' ||
      event.request?.context?.tableName ||
      event.source?.tableName;
    
    if (!tableName) {
      throw new Error('Post table name not found');
    }
    
    console.log('Using table name:', tableName);

    // Get current post to verify it exists and get current view count
    const getParams = {
      TableName: tableName,
      Key: { id: postId },
    };

    const getResult = await dynamodb.get(getParams).promise();

    if (!getResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Post not found' }),
      };
    }

    const currentViewCount = getResult.Item.viewCount || 0;
    const newViewCount = currentViewCount + 1;

    // Update the post with new view count
    const updateParams = {
      TableName: tableName,
      Key: { id: postId },
      UpdateExpression: 'SET viewCount = :viewCount, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':viewCount': newViewCount,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await dynamodb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        viewCount: updateResult.Attributes.viewCount,
        id: postId,
      }),
    };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
};
