const { Server } = require('socket.io');
const Notification = require('../models/Notification');

let ioInstance;

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:4824"],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    ioInstance = io;

    io.on('connection', (socket) => {
        console.info(`User connected: ${socket.id}`);

        // Listen for a 'join-room' event from the client
        socket.on("join-room", (uid) => {
            if (uid) {
                console.info(`User with UID ${uid} joined their notification room`);
                socket.join(uid); // Add the user to their specific room
            } else {
                console.error("No UID provided for room joining");
            }
        });

        socket.on('disconnect', () => {
            console.info(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Function to get IO instance
module.exports.getIo = () => ioInstance;
