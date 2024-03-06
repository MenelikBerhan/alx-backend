// redis hash set and get values for fields
import { createClient, print } from 'redis';

// on redis.v>4 should call client.connect()
const client = createClient();

// set event handlers for `error` and `connect` events
client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// field value paris to save in hash
const hashObject = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

// set value in hash for each field and print reply
Object.keys(hashObject).forEach((key) => {
  client.hset('HolbertonSchools', key, hashObject[key], print);
});

// get hash value
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) console.error(err.message);
  else console.log(reply);
});
