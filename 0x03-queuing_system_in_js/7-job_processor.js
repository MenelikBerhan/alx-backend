// Track progress and errors with Kue: Create the Job processor
import { createQueue } from 'kue';

const blackListedphoneNumbers = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  // track the progress of the job of 0 out of 100
  job.progress(0, 100);
  if (blackListedphoneNumbers.includes(phoneNumber)) {
    // fails the job
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }
  // Track the progress to 50%
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

const queue = createQueue();
// process 2 jobs of type 'push_notification_code_2' at a time
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
