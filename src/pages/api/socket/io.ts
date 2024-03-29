import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Socket, Server } from "net";
import { NextApiResponse } from "next";




export const config = {
    api: {
        bodyParser: false,
    },
};
export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: Server & {
            io: ServerIO
        }
    }
}


const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        })
        res.socket.server.io = io;
    }
    res.end()
}

export default ioHandler;