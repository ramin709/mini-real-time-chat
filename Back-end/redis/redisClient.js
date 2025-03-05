const { createCluster } = require("redis");
const CircuitBreaker = require("opossum");

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

// Add a proper connection check
redisClient.on("error", (err) => console.error("Redis Client Error:", err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
};

// Ensure Redis connection before exporting
connectRedis();

const storeInRedis = (key, value) => {
    return new Promise(async (resolve, reject) => {
        try {
            const node = await redisClient.getSlotMaster(key); // Ensure request goes to the correct node
            await node.set(key, value, { EX: 122400 });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

// Circuit breaker setup
const redisBreaker = new CircuitBreaker(storeInRedis, {
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    timeout: 5000,
});

redisBreaker.on("open", () => console.log("RedisBreaker is open"));
redisBreaker.on("halfOpen", () => console.log("RedisBreaker is half open"));
redisBreaker.on("close", () => console.log("RedisBreaker is closed"));

module.exports = { redisClient, redisBreaker };
