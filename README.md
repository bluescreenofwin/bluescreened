# Microblog App

Microblog is a serverless blogging demo built with Next.js (Pages Router) and AWS Amplify.  
Posts are stored in a GraphQL API powered by AWS AppSync & DynamoDB. Reading posts is public, but only members of the `BlogAdmins` Cognito group can create or delete posts.

## Features

- Public feed that lists posts in reverse chronological order
- Individual post view with owner attribution
- Protected authoring flow (Amplify Auth + Cognito groups)
- Admin-only delete action
- Deployed via AWS Amplify Hosting (optional)

## Prerequisites

- Node.js 18+
- Amplify CLI v12+ (`npm install -g @aws-amplify/cli`)
- AWS account with permissions to create Cognito, AppSync, DynamoDB, and IAM resources

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Initialize Amplify backend

```bash
amplify init
```

Accept the defaults or tailor the project name/environment as needed. The repository already contains `amplify/backend` resources:

- `amplify/backend/api/microblog` – GraphQL API with schema and auth rules

### 3. Configure authentication

```bash
amplify add auth
```

Choose **Default configuration with Social Provider** → **Username** (or email) sign-in. After `amplify push`, open the Cognito user pool and create a group named **BlogAdmins**. Add your admin user to this group—only these users can create/delete posts.

### 4. Push the backend

```bash
amplify push
```

Amplify will deploy the GraphQL API, DynamoDB table, and Cognito resources defined in the backend folder.

### 5. Configure environment variables

Create `.env.local` (not committed) and capture the output values from `amplify status`/`amplify env get`:

```bash
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_APPSYNC_REGION=us-east-1
NEXT_PUBLIC_APPSYNC_URL=https://<your-api-id>.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=<api-key-for-public-read>
NEXT_PUBLIC_APPSYNC_AUTH_TYPE=AMAZON_COGNITO_USER_POOLS
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=<cognito-user-pool-id>
NEXT_PUBLIC_USER_POOL_CLIENT_ID=<cognito-app-client-id>
```

- `NEXT_PUBLIC_APPSYNC_API_KEY` is required for unauthenticated read access (public feed).
- The auth type must remain `AMAZON_COGNITO_USER_POOLS` so mutations enforce Cognito group membership.

### 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in on `/new` with your BlogAdmins user to create posts.

## Deployment

1. Push the repository to a Git provider.
2. Connect the repo to **AWS Amplify Hosting**.
3. Configure the same environment variables in the Amplify Hosting console.
4. Deploy – Amplify will build the Next.js app and host it via CDN-backed SSR.

## Useful Commands

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run start    # Start production server locally
amplify status   # Inspect backend resources
amplify push     # Deploy backend changes
```

## Project Structure

- `components/` – UI building blocks (e.g., `PostList`)
- `lib/` – Amplify helper utilities
- `pages/` – Next.js routes for feed, new post form, and post details
- `src/graphql/` – GraphQL query & mutation definitions
- `amplify/backend/` – Infrastructure as code for Amplify

## Notes

- Only authenticated BlogAdmins can call `CreatePost`/`DeletePost`. The same rule is enforced in the GraphQL API (`@auth` with `groups: ["BlogAdmins"]`) and in the UI.
- Public readers use an AppSync API key. Rotate regularly and keep it confined to read-only operations.
- Run `npm audit fix` periodically to track dependency security updates.
