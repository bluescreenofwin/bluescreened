# Lambda Function Setup

The `incrementPostView` Lambda function needs environment variables to be set. 

## Option 1: Set via Amplify Console (Recommended)

1. Go to AWS Amplify Console
2. Select your app
3. Go to Backend environments → Functions
4. Select `incrementPostView`
5. Add environment variables:
   - `POST_TABLE_NAME`: Get from API outputs (e.g., `Post-microblog-us-west-1`)
   - `POST_TABLE_ARN`: Get from API outputs

## Option 2: Set via SSM Parameter Store

Run these commands (replace values with actual table name/ARN):

```bash
aws ssm put-parameter \
  --name "/amplify/d3s3zwvfnndh6w/microblog/AMPLIFY_function_incrementPostView_apiBluescreenedPostTableName" \
  --value "Post-microblog-us-west-1" \
  --type "String"

aws ssm put-parameter \
  --name "/amplify/d3s3zwvfnndh6w/microblog/AMPLIFY_function_incrementPostView_apiBluescreenedPostTableArn" \
  --value "arn:aws:dynamodb:us-west-1:ACCOUNT:table/Post-microblog-us-west-1" \
  --type "String"
```

## Option 3: Interactive Push

Run `amplify push` interactively and provide the values when prompted.

## Finding Table Name/ARN

Run:
```bash
amplify status
```

Or check the API stack outputs in AWS CloudFormation console.

