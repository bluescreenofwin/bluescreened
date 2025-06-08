# Microblog App

A simple microblogging platform built with Next.js, deployed on AWS Amplify, and backed by DynamoDB. Styled with Bootstrap 5.

## Setup

1. `npm install`
2. Create a DynamoDB table with:
   - Table name: as defined in `.env.local` (default `MicroblogTable`)
   - Primary key: `id` (String)
3. Copy `.env.local.example` to `.env.local` and set:
   ```bash
   AWS_REGION=us-east-1
   POSTS_TABLE=MicroblogTable
   ```
4. `npm run dev` to start locally.

## Deployment on AWS Amplify

- Connect your GitHub repo to Amplify.
- Set Amplify environment variables `AWS_REGION` and `POSTS_TABLE`.
- Amplify will build and deploy your Next.js app automatically.
