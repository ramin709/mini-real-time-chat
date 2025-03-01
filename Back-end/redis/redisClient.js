const { createCluster } = require("redis");

const redisClient = createCluster({
    rootNodes: [
        { url: "redis://redis-stateful-0.redis.default.svc.cluster.local:6379" },
        { url: "redis://redis-stateful-1.redis.default.svc.cluster.local:6379" },
        { url: "redis://redis-stateful-2.redis.default.svc.cluster.local:6379" },
        { url: "redis://redis-stateful-3.redis.default.svc.cluster.local:6379" },
        { url: "redis://redis-stateful-4.redis.default.svc.cluster.local:6379" },
        { url: "redis://redis-stateful-5.redis.default.svc.cluster.local:6379" },
    ],
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