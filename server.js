const express = require('express')
const bp = require("body-parser");
const { Socket } = require('socket.io');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(express.json())
app.use(bp.urlencoded({ extended: false }));
app.use(express.static(__dirname))


var messages = []

const server = http.listen(5000, () => {
    console.log("server is listening on", server.address().port)
})

var user = {}

io.on('connection', (Socket) => {
    Socket.on('new-user-joined', name => {
        console.log("new user joined ", name)
        user[Socket.id] = name;
        Socket.broadcast.emit("user-joined", `<p class="text-muted font-italic text-center">new user joied ${name}  </p>` );
    })
    Socket.on('send', msg => {
        messages.push(msg)
        Socket.broadcast.emit(
            'receive', msg
        )
    })
})

