module.exports = {
  env: {
    POSTS_TABLE: process.env.POSTS_TABLE,
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BASE_URL: process.env.BASE_URL
  },
  target: "serverless"
};