// test for createPushNotificationsJobs function
import { createQueue } from 'kue';
import { expect } from 'chai';
import { spy } from 'sinon';
import createPushNotificationsJobs from './8-job';

const queue = createQueue();

describe('createPushNotificationsJobs', function () {
  // By default jobs aren't processed when created during test mode
  // To enable job processing by passing true to testMode.enter
  before(() => { // excuted once before all tests
    queue.testMode.enter();
  });

  // excuted once after all tests
  after(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('Throws Error with right message when jobs is not an array', function () {
    // expect(fn).to.throw();     // Good! Tests `fn` as desired
    // expect(fn(42)).to.throw();   // Bad! Tests result of `fn()`, not `fn`
    // expect(() => fn(42)).to.throw();  // Good!
    expect(() => createPushNotificationsJobs(12, queue)).to.throw('Jobs is not an array');
  });

  it('Creates two new jobs with correct type & data, and logs right message.', function () {
    const logSpy = spy(console, 'log');
    const jobs = [{ phoneNumber: '1', message: 'hi' }, { phoneNumber: '2', message: 'howdie' }];
    createPushNotificationsJobs(jobs, queue);

    expect(logSpy.calledTwice).to.be.true;
    expect(logSpy.calledOnceWith('Notification job created: 1'));
    expect(logSpy.calledOnceWith('Notification job created: 2'));

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    // eql is like .deep.equal
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);
    expect(queue.testMode.jobs[1].data).to.eql(jobs[1]);
    logSpy.restore();
  });
});
