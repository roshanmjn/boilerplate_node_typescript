import express, { type Request, type Response, type NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { customLogger } from "./utils/Logger";
import { setHttpMethod } from "./utils/Logger/logUser";
import * as uuid from "uuid";
import v1 from "./routes";
import errorHandler from "./middlewares/errorHandler";
import { NotFound, HttpException } from "./middlewares/errors";
import initSocket from "./sockets";
import { initializeSocket } from "./sockets/instance";

const app = express();
const io = initializeSocket(app);

app.use(morgan("combined"));

const port = process.env.PORT || 3000;
app.use(
    cors({
        origin: "*",
    })
);

/** Middleware for catching the Http method for logger usage. */
function getHttpMiddleware(req: Request, _: Response, next: NextFunction) {
    let request_id = uuid.v4();
    setHttpMethod(req.method, request_id);
    next();
}
app.use(getHttpMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
    res.status(200).send("Welcome to boiler plate.");
});

app.use("/force-shutdown", (_, res) => {
    console.warn("Received shutdown request");
    customLogger.warn("forceShutdown", "Received shutdown request");
    res.send("Server shutting down...");
    process.exit(0);
});

app.use("/api/v1", v1);

app.all("*", (req) => {
    let ipAddress = req.socket.remoteAddress == "::1" ? "localhost" : req.headers["x-forwarded-for"];
    customLogger.info("PageNotFound", `Page not found: ${req.protocol}://${ipAddress}${req.originalUrl}, Browser Type: ${req.headers["user-agent"]}`);
    throw new NotFound("Page not found!");
});

/** Error handler middleware */
app.use(errorHandler);

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    // @ts-ignore
    socket.user_ip = /127\.0\.0\.1/.test(socket.handshake.address) ? "localhost" : socket.handshake.address;

    initSocket(socket, io);

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

app.listen(port, () => {
    try {
        console.log(`listening to http://localhost:${port}`);
    } catch (err: any) {
        customLogger.error("Server Error", "Error on app.js", err.stack);
        throw new HttpException(500, "Internal server error");
    }
});

process.on("uncaughtException", (err) => {
    customLogger.error("uncaughtException", "Error on app.js", [err.stack]);
});

process.on("unhandledRejection", (reason, promise) => {
    if (promise instanceof Promise) {
        promise.catch((error) => {
            let data = "";
            if (error.sql) {
                data += "SQL: " + error.sql + "\n \n \n  ";
            }
            if (error.sqlMessage) {
                data += "SQL Message: " + error.sqlMessage + "\n \n \n";
            }

            if (error.code) {
                data += "Code: " + error.code + "\n \n \n";
            }

            if (error.errno) {
                data += "Errno: " + error.errno + "\n \n \n";
            }

            if (error.address) {
                data += "Address: " + error.address + "\n \n \n";
            }

            if (error.port) {
                data += "Port: " + error.port + "\n \n \n";
            }
            if (error.message) {
                data += "Message: " + error.message + "\n \n \n";
            }
            if (error.stack) {
                data += "Stack: " + error.stack + "\n \n \n";
            }

            customLogger.error("unhandledRejection", "Rejected Promise Value:", [error, data]);
        });
    }
});

process.on("SyntaxError", (err) => {
    customLogger.error("SyntaxError", "Syntax Error", [err.stack]);
});
