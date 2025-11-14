import 'bootstrap/dist/css/bootstrap.min.css';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.css';
import { useEffect } from 'react';

import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Import Bootstrap JS for interactive components
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <Component {...pageProps} />;
}
