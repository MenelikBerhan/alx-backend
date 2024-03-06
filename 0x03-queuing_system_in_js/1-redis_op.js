// connect to redis server, set and get values
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

// sets value to key schoolName & display result
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    print(err, reply);
  });
}

// finds value associated with key `schoolName`
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) console.error(err.message);
    else console.log(reply);
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
