const sendMessage = require("../kafka/producer.js")
const redisClient = require("../redis/redisClient.js")
const express = require("express")
const MessageModel = require("../models/Message.js")

const router = express.Router()

router.post("/send", async(req, res) => {
    const {user, message} = req.body;

    if(!user || !message) {
        res.status(400).json({error: "The user and the message are required"})
    }

    await redisClient.set(`msg: ${Date.now()}`, JSON.stringify({user, message}));

    await MessageModel.create({user, message, timestamp: Date.now()})

    sendMessage(process.env.KAFKA_TOPIC, {user, message})

    res.status(200).json({success: true, message: "Message sent!"})
})

module.exports = router