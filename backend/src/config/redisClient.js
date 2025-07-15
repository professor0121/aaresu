import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

await redisClient.connect(); // ensure this is awaited during startup
