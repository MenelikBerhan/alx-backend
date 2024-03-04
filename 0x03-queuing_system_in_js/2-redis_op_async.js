// connect to redis server, set and get values using promises
import { createClient, print } from 'redis';

const { promisify } = require('util');

// on redis.v>4 should call client.connect()
const client = createClient();
// set event handlers for `error` and `connect` events
client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});
client.on('connect', () => {
  console.error('Redis client connected to the server');
});
const getAsync = promisify(client.get).bind(client);
// sets value to key schoolName & display result
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    print(err, reply);
  });
}

// finds value associated with key `schoolName`
async function displaySchoolValue(schoolName) {
  const reply = await getAsync(schoolName);
  console.log(reply);
  // getAsync(schoolName)
  //   .then((value) => { console.log(value); })
  //   .catch((err) => { console.error(err.message); });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
