import 'bootstrap/dist/css/bootstrap.min.css';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.css';
import { useEffect } from 'react';

import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

// Initialize scheduler for daily emails (server-side only)
if (typeof window === 'undefined') {
  const { scheduleDailyEmail } = require('../lib/scheduler');
  scheduleDailyEmail();
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Import Bootstrap JS for interactive components
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <Component {...pageProps} />;
}
