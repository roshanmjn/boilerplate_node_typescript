import http from "http";
import { Server } from "socket.io";
import { Express } from "express";

export function initializeSocket(app: Express) {
    const server = http.createServer(app);
    return new Server(server, {
        cors: {
            origin: "*",
        },
        pingInterval: 20000, // how often to ping
        pingTimeout: 20000, // how often to pong: time after which the connection is considered timed-out.
        connectionStateRecovery: {
            maxDisconnectionDuration: 120000,
        },
        transports: ["websocket", "polling"],
    });
}
