require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const router = require('./routes/messages.js');

const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(express.json());
app.use("/messages", router);

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log("Server is on")
})