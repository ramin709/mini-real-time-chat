const kafka = require('kafka-node');
const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const CHAT_TOPIC = process.env.CHAT_TOPIC || 'chat-messages';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';

const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER });
const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT })
const consumer = new kafka.Consumer(kafkaClient, [{topic: CHAT_TOPIC}], {autoCommit: true})

consumer.on("message", async(message) => {
    console.log("consumer is ready");

    try {

        const chatMessage = JSON.parse(message.value);

        redisClient.lPush("chat-history", JSON.stringify(chatMessage))
        redisClient.lTrim("chat-history", 0, 49);
        
    } catch (error) {
        console.log("An error has occurred in redis", error.message)
    }
})

consumer.on("error", error => {
    console.log("An error has occurred in consumer ", error.message)
})