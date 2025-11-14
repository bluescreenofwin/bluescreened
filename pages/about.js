import Link from 'next/link';

export default function About() {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="mb-4">
            <Link href="/" className="text-decoration-none text-muted mb-3 d-inline-block">
              ← Back to posts
            </Link>
            <h1 className="display-4 fw-bold mb-3">About Me</h1>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="post-content" style={{ lineHeight: '1.8' }}>
                <p className="lead">
                  Welcome to Bluescreenofwin's Microblog!
                </p>
                <p>
                  This is a personal microblogging platform where I share my thoughts, 
                  experiences, and updates. Built with Next.js and AWS Amplify, this 
                  blog showcases modern web development practices and serverless architecture.
                </p>
                <p>
                  Feel free to browse through the posts and explore the content. If you're 
                  interested in the technical details, this blog is built using:
                </p>
                <ul>
                  <li><strong>Next.js</strong> - React framework for production</li>
                  <li><strong>AWS Amplify</strong> - Full-stack serverless platform</li>
                  <li><strong>GraphQL</strong> - API powered by AWS AppSync</li>
                  <li><strong>DynamoDB</strong> - NoSQL database for storing posts</li>
                  <li><strong>Amazon Cognito</strong> - Authentication and user management</li>
                  <li><strong>Bootstrap 5</strong> - Modern, responsive UI framework</li>
                </ul>
                <p>
                  Thanks for visiting!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

