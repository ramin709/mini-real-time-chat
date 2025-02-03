const kafka = require('kafka-node');
const {io} = require('../socket/socketHandler.js')
const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST});
const consumer = new kafka.Consumer(kafkaClient, [{topic: process.env.KAFKA_TOPIC, partition: 0}])

consumer.on("message", async(message) => {
    console.log("consumer is ready");

    io.emit("newMessage", JSON.parse(message))    
})

consumer.on("error", error => {
    console.log("An error has occurred in consumer ", error)
})