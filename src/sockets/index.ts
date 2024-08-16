import testSocket from "./testsocket";
import { Server, Socket } from "socket.io";

function initSocket(socket: Socket, io: Server) {
    // const user_id = socket?.handshake?.headers["user_id"] as string;

    const socketsToInitialize = [testSocket];

    socketsToInitialize.forEach((socketFn) => socketFn(socket, io));
}
export default initSocket;
