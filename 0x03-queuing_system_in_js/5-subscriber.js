// subscribe to a channel
import { createClient } from 'redis';

const client = createClient();

// event listners for `error` & `connect`
client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// subscribe to `holberton school channel` channel
client.subscribe('holberton school channel', (err) => {
  if (err) console.error(err.message);
});

// add event listner for `message` event
client.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    client.unsubscribe((err) => {
      if (err) console.error(err.message);
    });
    client.quit((err) => {
      if (err) console.error(err.message);
    });
  }
});
