# Step-by-Step Lambda Function Setup

## Step 1: Add the Lambda Function via Amplify CLI

Run this command in your terminal:

```powershell
cd C:\Users\bluescreenofwin\Documents\cursor\bluescreened
amplify add function
```

**When prompted, select:**
1. **"Lambda function (serverless function)"** - Press Enter
2. **Function name:** Type `incrementPostView` and press Enter
3. **Runtime:** Select `nodejs` (use arrow keys, then Enter)
4. **Template:** Select `Hello World` (we'll replace the code)
5. **Advanced settings:** Select `No` (or `Yes` if you want to configure more)
6. **Lambda trigger:** Select `No` (we'll call it via GraphQL)

## Step 2: Replace the Function Code

After the function is created, replace the code in:
`amplify/backend/function/incrementPostView/src/index.js`

With this code:

```javascript
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
```

## Step 3: Configure Function Dependencies

The function needs access to the DynamoDB table. When you run `amplify push`, it will ask about permissions. Make sure to:

1. Grant the function access to the API (bluescreened)
2. The function will automatically get DynamoDB permissions if it's linked to the API

## Step 4: Push to AWS

Run:

```powershell
amplify push
```

**When prompted:**
1. **"Are you sure you want to continue?"** - Type `y` and press Enter
2. **"Do you want to update code for this updated Lambda function?"** - Type `y` and press Enter
3. If asked about environment variables:
   - `POST_TABLE_NAME`: `Post-kjn5z4i35rfghk3smjksxj23py-microblog`
   - `POST_TABLE_ARN`: `arn:aws:dynamodb:us-west-1:040479514298:table/Post-kjn5z4i35rfghk3smjksxj23py-microblog`

## Step 5: Verify the GraphQL Mutation

The GraphQL mutation `incrementPostView` is already configured in your schema. After the function is deployed, it should automatically be connected via the `@function` directive.

## Step 6: Test

1. Visit a post page in your app
2. Check the view count - it should increment
3. Check CloudWatch logs if there are any issues

## Troubleshooting

If the function isn't connected to AppSync:
1. Go to AWS AppSync Console
2. Select your API (bluescreened)
3. Go to Schema → Data Sources
4. Verify the `incrementPostView` data source points to your Lambda function
5. Check the resolver for `Mutation.incrementPostView`

