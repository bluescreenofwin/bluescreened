import cron from 'node-cron';

/**
 * Schedule daily email job
 * Runs every day at midnight UTC
 */
export function scheduleDailyEmail() {
  // Schedule to run daily at 00:00 UTC
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily email job at', new Date().toISOString());
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/daily-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': process.env.CRON_SECRET || '',
        },
      });

      const result = await response.json();
      console.log('Daily email job result:', result);
    } catch (error) {
      console.error('Error running daily email job:', error);
    }
  }, {
    scheduled: true,
    timezone: 'UTC',
  });

  console.log('Daily email scheduler initialized');
}

