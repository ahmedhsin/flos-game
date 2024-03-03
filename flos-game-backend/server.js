#!/usr/bin/node
import http from 'http'
import { Server } from "socket.io";
import cors from 'cors'
import  gameHandler  from "./src/gameHandler.js"
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})


const onConnection = (socket) => {
  gameHandler(io, socket);
}

io.on("connection", onConnection);


const PORT = 3000
httpServer.listen(PORT, (err) => {
    if(err) return console.error("Error while intiate the server")
    console.log("Server start listening on port", PORT)
})