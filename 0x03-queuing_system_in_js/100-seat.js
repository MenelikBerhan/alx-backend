import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import { createQueue } from 'kue';

// queue
const queue = createQueue();

// redis client
const client = createClient();
// promisify client.get
const getAsync = promisify(client.get).bind(client);

// create app
const app = express();
const port = 1245;

let reservationEnabled = true;

// set the key `available_seats` with the `number`
function reserveSeat(number) {
  client.set('available_seats', number);
}

// return the current number of available seats
async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return availableSeats;
}

// GET /available_seats - returns the number of seat available
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.send(JSON.stringify({ numberOfAvailableSeats }));
});

// GET /reserve_seat - reserves a seat by creating a 'reserve_seat' type job in queue
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) res.send({ status: 'Reservation are blocked' });
  else {
    // create a queue and add event handlers
    const job = queue.create('reserve_seat')
      .save((err) => {
        if (!err) res.send(JSON.stringify({ status: 'Reservation in process' }));
        else res.send(JSON.stringify({ status: 'Reservation failed' }));
      });
    job.on('complete', () => { console.log(`Seat reservation job ${job.id} completed`); });

    job.on('failed', (errorMessage) => {
      console.error(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
  }
});

// GET /process - process jobs by reserving a seat
app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    reserveSeat(numberOfAvailableSeats - 1);
    // no more reservation
    if (numberOfAvailableSeats - 1 === 0) reservationEnabled = false;
    if (numberOfAvailableSeats - 1 >= 0) done(); // job successful
    else done(new Error('Not enough seats available')); // job failed
  });
  res.send(JSON.stringify({ status: 'Queue processing' }));
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
  reserveSeat(50); // at start set the number of available to 50
});
