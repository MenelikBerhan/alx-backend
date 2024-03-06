// Writing the job creation function

export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error('Jobs is not an array');

  for (const jobData of jobs) {
    // create job of type 'push_notification_code_3' for each, and notify if no error encountered
    const job = queue.create('push_notification_code_3', jobData);
    // saving the job here causes errors in 8-job.test.js ???
    // .save((err) => {
    //   if (!err) console.log(`Notification job created: ${job.id}`);
    // });

    // add handlers for job `complete`, `progress` & `failed` events
    job.on('complete', () => { console.log(`Notification job ${job.id} completed`); });

    job.on('failed', (errorMessage) => {
      console.error(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
    // if saved last, test works. WHY???
    job.save((err) => {
      if (!err) console.log(`Notification job created: ${job.id}`);
    });
  }
}
