// connect to redis server
import { createClient } from 'redis';

// on redis.v>4 should call client.connect()
const client = createClient();
// set event handlers for `error` and `connect` events
client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
