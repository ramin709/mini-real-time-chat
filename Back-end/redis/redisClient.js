const { createCluster } = require("redis");
const CircuitBreaker = require("opossum")

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

const storeInRedis = async(key, value, ex) => {
    try {

        await redisClient.set(key, value , {EX: 122400})
        
    } catch (error) {
        console.log("Failed to add in redis:", error.message);
    }
}

const redisBreaker = new CircuitBreaker(storeInRedis, {
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    timeout: 5000
})

redisBreaker.on("open", () => console.log("RedisBreaker is open"));
redisBreaker.on("halfOpen", () => console.log("RedisBreaker is half open"));
redisBreaker.on("close", () => console.log("RedisBreaker is close"));

module.exports = {redisClient, redisBreaker};