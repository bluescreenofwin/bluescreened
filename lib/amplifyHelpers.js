import awsconfig from '../aws-exports';

export const ADMIN_GROUP = 'BlogAdmins';

export const getReadAuthMode = () => {
  // For public reads, prefer API_KEY if available, otherwise fall back to user pools
  // Note: If no API key is configured, you may need to allow unauthenticated access
  // or ensure users can read without authentication
  if (awsconfig.aws_appsync_apiKey) {
    return 'API_KEY';
  }
  // If no API key, try user pools (user must be signed in)
  // For truly public access, you may need to configure API key auth in AppSync
  return 'AMAZON_COGNITO_USER_POOLS';
};

export const isAdminUser = (user) => {
  if (!user) return false;
  const groups =
    user.signInUserSession?.accessToken?.payload?.['cognito:groups'] ?? [];
  return groups.includes(ADMIN_GROUP);
};

