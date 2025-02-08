const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "redis",  // Kubernetes service name
        port: 6379
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    try {
        await redisClient.connect();  // Ensure the client is connected before use
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
})();

module.exports = redisClient;