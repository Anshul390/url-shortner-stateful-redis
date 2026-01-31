const redisClient = require("../service/redis");

const WINDOW_SIZE = 60; // seconds
const MAX_REQUESTS = 10;

async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip;

    const key = `rate:${ip}`;

    // increment request count
    const current = await redisClient.incr(key);

    // if first request, set expiry
    if (current === 1) {
      await redisClient.expire(key, WINDOW_SIZE);
    }

    // block if limit exceeded
    if (current > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next(); // fail-open (important)
  }
}

module.exports = rateLimiter;
