// config/redisClient.js
import { createClient } from 'redis';

export const redisClient = createClient({
  username: 'default',
  password: 'nFNQdefL93b3A8GmAtcPNi3iakYEVrdP',
  socket: {
    host: 'redis-14605.c73.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 14605,
  },
});

redisClient.on('error', err => console.error('❌ Redis Client Error:', err));

// Export a connect function
export const connectRedis = async () => {
  await redisClient.connect();
  console.log('✅ Redis Cloud connected');
};
