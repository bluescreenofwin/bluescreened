# Microblog

A Next.js microblog with AWS Lambda (Node.js 22) via API Gateway.

## Setup

1. Install dependencies

```bash
npm ci
```

2. Initialize Amplify

```bash
amplify init
amplify add api
amplify add function
# configure functions and table
amplify push
```

3. Set environment variables

- POSTS_TABLE
- AWS_REGION
- NEXT_PUBLIC_API_URL
- BASE_URL

4. Run locally

```bash
npm run dev
```

5. Build & start

```bash
npm run build
npm run start
```

## Features

- Node.js 22 runtime
- Separate Lambdas: getPost, listPosts, createPost, deletePost
- API Gateway with IAM auth for list/create/delete
- Homepage with featured posts
- RSS feed at `/rss`
