require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const {initialSocket} = require("./socket/socketHandler.js");
const messageRoute = require("./routes/messages.js")

const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(express.json());
app.use("/messages", messageRoute)

initialSocket(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log("Server is on")
})