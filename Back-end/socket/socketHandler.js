const socketIo = require('socket.io');

let io;

const initialSocket = (server) => {
    io = socketIo(server, {
        cors: {origin: "*"}
    })
}

io.on("connection", socket => {
    console.log("New client connected", socket.id)

    socket.on("disconnect", () => {
        console.log("Client is disconnected", socket.id)
    })
})

module.exports = {io , initialSocket}