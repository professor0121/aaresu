import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node"; // Import the arcjet module
import { ENV } from "../config/env.js"; // Import the environment variables

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const result = await aj.check({
      ip: req.ip,
      path: req.originalUrl,
      headers: req.headers,
      method: req.method,
    });

    if (!result.allowed) {
      return res.status(429).json({
        message: "Request blocked by Arcjet",
        reason: result.reason,
      });
    }

    next();
  } catch (err) {
    console.error("Arcjet Error:", err);
    next(); // fail open
  }
};
