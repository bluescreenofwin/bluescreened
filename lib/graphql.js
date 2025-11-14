export const LIST_POSTS = /* GraphQL */ `
  query ListPosts {
    listPosts {
      items {
        id
        title
        content
        owner
        viewCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_POST = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      content
      owner
      viewCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = /* GraphQL */ `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      owner
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = /* GraphQL */ `
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      id
    }
  }
`;

export const UPDATE_POST = /* GraphQL */ `
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      title
      content
      owner
      viewCount
      createdAt
      updatedAt
    }
  }
`;

export const INCREMENT_POST_VIEW = /* GraphQL */ `
  mutation IncrementPostView($postId: ID!) {
    incrementPostView(postId: $postId) {
      success
      viewCount
      id
    }
  }
`;

