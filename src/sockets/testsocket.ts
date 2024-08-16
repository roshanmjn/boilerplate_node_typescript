import { Socket } from "socket.io";

export default function (socket: Socket, io: any) {
    // const user_id = socket.handshake.headers["user_id"];

    socket.on("join", (data: any) => {
        console.log("joined:", data);
        io.emit("joined", data);
    });

    socket.on("leave", (data: any) => {
        console.log("left:", data);
    });
}
