# Deploying the Lambda Function

The Lambda function for view tracking is set up but needs to be properly registered with Amplify. 

## Current Status
- ✅ Lambda function code is ready (`amplify/backend/function/incrementPostView/src/index.js`)
- ✅ GraphQL mutation is configured in schema
- ✅ API route is updated
- ⚠️ Function needs to be properly registered with Amplify CLI

## Solution: Use Amplify Console or Manual Lambda Creation

Since the manual function structure is causing issues with Amplify CLI, you have two options:

### Option 1: Deploy via AWS Console (Recommended)

1. Go to AWS Lambda Console
2. Create a new function:
   - Name: `incrementPostView-microblog`
   - Runtime: Node.js 18.x
   - Upload the code from `amplify/backend/function/incrementPostView/src/index.js`
3. Set environment variables:
   - `POST_TABLE_NAME`: `Post-kjn5z4i35rfghk3smjksxj23py-microblog`
   - `POST_TABLE_ARN`: `arn:aws:dynamodb:us-west-1:040479514298:table/Post-kjn5z4i35rfghk3smjksxj23py-microblog`
4. Add IAM role with DynamoDB permissions (GetItem, UpdateItem on the Post table)
5. In AppSync Console, update the `incrementPostView` resolver to point to this Lambda function ARN

### Option 2: Remove @function directive and use direct API calls

The current setup with `@function` directive expects Amplify to manage the Lambda. You could:
1. Remove the `@function` directive from schema
2. Create the Lambda manually in AWS Console
3. Update the API route to call the Lambda directly via AWS SDK instead of GraphQL

### Option 3: Fix Amplify CLI registration

The function files are in place but Amplify CLI isn't recognizing them properly. You may need to:
1. Delete the function directory
2. Run `amplify add function` interactively
3. Choose "Lambda function" and configure it
4. Copy the code from the backup

The GraphQL mutation will work once the Lambda is deployed and connected to AppSync.

