// src/middleware/requestLogger.js
import useragent from 'useragent';

const requestLogger = (req, res, next) => {
  // IP (works behind proxies/load balancers)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Method and full URL
  const method = req.method;
  const url = req.originalUrl;

  // Protocol mode (http or https)
  const mode = req.protocol;

  // User Agent parsing
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceType = agent.device.toString();   // e.g. "Other", "iPhone", "Desktop"
  const browser = `${agent.family} ${agent.major}.${agent.minor}`;

  // Log the request
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  console.log(`IP: ${ip}`);
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Device: ${deviceType}`);
  console.log(`Browser: ${browser}`);

  next();
};

export default requestLogger;
