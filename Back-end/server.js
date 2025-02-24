require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const router = require('./routes/messages.js');

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: '*',  // Adjust the protocol and port based on your frontend setup
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use("/messages", router);

const PORT = process.env.PORT || 5000

mongoose.connect("mongodb://mongo-stateful-0.mongodb:27017,mongo-stateful-1.mongodb:27017,mongo-stateful-2.mongodb:27017/messagesDB?replicaSet=rs0", {
    useNewURLParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB is connected"))
    .catch(error => console.log("MongoDB failed to connect"))

server.listen(PORT, () => {
    console.log("Server is on")
})