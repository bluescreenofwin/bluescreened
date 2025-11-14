import { API } from 'aws-amplify';
import { getReadAuthMode } from '../../lib/amplifyHelpers';
import { INCREMENT_POST_VIEW } from '../../lib/graphql';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    // Call the Lambda function via GraphQL mutation
    // This uses API_KEY auth which allows public access
    const authMode = getReadAuthMode();
    
    const { data } = await API.graphql({
      query: INCREMENT_POST_VIEW,
      variables: { postId },
      authMode: authMode, // Use API_KEY for public access
    });

    if (!data?.incrementPostView?.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to increment view count',
      });
    }

    return res.status(200).json({
      success: true,
      viewCount: data.incrementPostView.viewCount,
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    
    // Extract error message
    const errorMessage = error?.errors?.[0]?.message || 
                        error?.message || 
                        'Internal server error';
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
