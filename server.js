var fs = require('fs')
const Redis = require("ioredis");
const express = require('express');
const https = require('https');

const app = express();

const server = https.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const redis = new Redis();

redis.subscribe('chat-channel')

redis.on('message', (channel, message) => {
    let emit = JSON.parse(message)
    console.log('a user connected');
    console.log(channel, message, emit.event, emit.data)

    io.emit(channel + ':' + emit.event, emit.data)
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});