const sendMessage = require("../kafka/producer.js")
const { redisBreaker } = require("../redis/redisClient.js")
const express = require("express")
const MessageModel = require("../models/Message.js")

const router = express.Router()

router.post("/send", async (req, res) => {
    const { user, content } = req.body;

    if (!user || !content) {
        res.status(400).json({ error: "The user and the message are required" })
    }

    await Promise.all(
        await redisBreaker.fire(`msg: ${Date.now()}`, JSON.stringify({ user, content })),
        await MessageModel.create({ user, content, timestamp: Date.now() }),
        sendMessage(process.env.KAFKA_TOPIC, { user, content })
    )

    res.status(200).json({ success: true, message: "Message sent!" })
})

module.exports = router