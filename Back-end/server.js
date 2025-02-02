require('dotenv').config();

const express = require('express');
const webSocket = require('ws');
const kafka = require('kafka-node');
const redis = require('redis');

const PORT = process.env.PORT || 5000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const CHAT_TOPIC = process.env.CHAT_TOPIC || 'chat-messages';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';

const app = express();
app.use(express.json());

const webSocketServer = webSocket.Server({ noServer: true });
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER });
const producer = new kafka.Producer(kafkaClient)
const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT })

producer.on("ready", () => {
    console.log("Producer is ready")
})

producer.on("error", error => {
    console.log("An error has occurred ", error.message)
})

webSocketServer.on("connection", (ws) => {
    console.log("WebSocket is established")

    ws.on("message", async (message) => {
        try {
            const payload = [{ topic: CHAT_TOPIC, messages: JSON.parse(message) }]

            producer.send(payload, (error, data) => {
                error && console.log("An error has occurred while sending from producer: ", error)
            })
        } catch (error) {
            console.log(error.message)
        }
    })

    ws.on("close", () => {
        console.log("WebSocket is closed")
    })
})

const server = app.listen(PORT, () => {
    console.log("Server is on")
})

server.on("upgrade", (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket, head, (ws) => {
        webSocketServer.emit("connection", ws, request)
    })
})