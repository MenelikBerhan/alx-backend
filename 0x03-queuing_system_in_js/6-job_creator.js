// create queue and job using Kue
import { createQueue } from 'kue';

// create queue
// eslint-disable-next-line camelcase
const queue = createQueue();

const jobData = {
  phoneNumber: '123',
  message: 'Hello!',
};

// create job
const job = queue.create('push_notification_code', jobData)
  .save((error) => {
    if (!error) console.log(`Notification job created: ${job.id}`);
  });

// handle job `complete` event
job.on('complete', () => { console.log('Notification job completed'); });

// handle job 'failed' event
job.on('failed', () => { console.error('Notification job failed'); });
