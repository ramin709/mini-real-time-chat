require('dotenv').config();

const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 6379,
})

redisClient.on("error", error => {
    console.log("An error occurred while connecting to redis");
})

module.exports = redisClient