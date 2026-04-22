const { rateLimit } = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const { createClient } = require("redis");
require("dotenv").config();
const redisClient = createClient({ url: process.env.RedisUrl });
redisClient.connect().catch(console.error);

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: "Too many login attempts. Try again in 15 minutes" },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl-auth",
  }),
});

module.exports = { generalLimiter, authLimiter };
