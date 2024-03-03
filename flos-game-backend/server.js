#!/usr/bin/node
import http from 'http'
import { Server } from "socket.io";
import  gameHandler  from "./src/gameHandler.js"
const port = process.env.PORT || 4000;
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["https://ahmedhsin.github.io"],
    methods: ["GET", "POST"],
    credentials: true
  }
})


const onConnection = (socket) => {
  gameHandler(io, socket);
}

io.on("connection", onConnection);



httpServer.listen(port, (err) => {
    if(err) return console.error("Error while intiate the server")
    console.log("Server start listening on port", port)
})