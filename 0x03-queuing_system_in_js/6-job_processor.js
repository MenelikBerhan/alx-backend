// the Job processor

import { createQueue } from 'kue';

const queue = createQueue();

// function to be used in processing jobs
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// process jobs of type `'push_notification_code'`
queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
