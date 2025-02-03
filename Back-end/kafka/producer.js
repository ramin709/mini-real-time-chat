const Kafka = require("kafka-node")
require('dotenv').config();

const kafkaClient = new Kafka.KafkaClient({kafkaHost: process.env.KAFKA_HOST})
const producer = new Kafka.Producer(kafkaClient)

producer.on("ready" , () => {
    console.log("Producer is ready to send");
})

producer.on("error" , (error) => {
    console.log("An error has occurred in producer" , error)
})

const sendMessage = (topic , message) => {
    const payload = [{topic , messages: JSON.stringify(message)}]

    producer.send(payload, (error , data) => {
        error ? console.log("Error sending data" , error) : console.log("Successfully sent")
    })
}

module.exports = sendMessage