const sendMessage = require("../kafka/producer.js");
const { redisBreaker } = require("../redis/redisClient.js");
const express = require("express");
const MessageModel = require("../models/Message.js");

const router = express.Router();

router.post("/send", async (req, res) => {
    const { user, content } = req.body;

    if (!user || !content) {
        return res.status(400).json({ error: "The user and the message are required" });
    }

    try {
        const results = await Promise.allSettled([
            redisBreaker.fire(`msg: ${Date.now()}`, JSON.stringify({ user, content })),
            MessageModel.create({ user, content, timestamp: Date.now() }),
            sendMessage(process.env.KAFKA_TOPIC, { user, content })
        ]);

        // Handle errors separately
        results.forEach((result, index) => {
            if (result.status === "rejected") {
                console.error(`Task ${index + 1} failed:`, result.reason);
            }
        });

        res.status(200).json({ success: true, message: "Processing completed, check logs for failures!" });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
