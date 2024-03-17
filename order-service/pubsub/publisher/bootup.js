// Tried using https://github.com/bitfinexcom/grenache-nodejs-ws/blob/master/examples/sub.js
// but it didn't seem to connect. Going ahead with redis to save time.

const redis = require('redis');
export const publisher = redis.createClient();
export const initializePublisher = async () => {
  await publisher.connect();

}