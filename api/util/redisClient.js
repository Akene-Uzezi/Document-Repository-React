const Redis = require("redis");
require("dotenv").config();
const redisClient = Redis.createClient({ url: process.env.RedisUrl });
redisClient.on("error", (err) => console.log("redis error", err));
redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((err) => console.error(err));

module.exports = redisClient;
