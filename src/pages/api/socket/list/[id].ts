import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../io";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken"
import { ACTION, ENTITY_TYPE } from "@prisma/client";




const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        const { title } = req.body
        const { id:listId, orgId, boardId } = req.query
        const { trello_auth_token } = req.cookies
        if (!trello_auth_token) res.status(404).json({ message: "token missing" })
        // @ts-ignore
        const id = jwt.verify(trello_auth_token, process.env.SECRETE_TOKEN!).id
        const user = await db.user.findUnique({
            where: {
                id
            }
        })
        if (!user) return res.status(401).json({ message: "unauthorized" })
        const list = await db.list.findUnique({
            where: { id: listId as string }
        })
        if (!list) return res.status(404).json({ message: "list missing" })
        if (req.method === "PUT") {
            const lis = await db.list.update({
                where: { id: list.id },
                data: { title }
            })
            res.socket.server.io.emit(`update:$${boardId}`, lis)
            await db.auditLog.create({
                data: {
                    orgId: orgId as string,
                    entityId: list.id,
                    entityType: ENTITY_TYPE.LIST,
                    entityTitle: list.title,
                    action: ACTION.CREATE,
                    boardId: boardId as string,
                    userId: user.id,
                    userImage: user.image || "",
                    userName: user.name
                }
            });
        }
        if (req.method === "DELETE") {
            const list = await db.list.update({
                where: {
                    id: listId as string,
                    trash: false
                },
                data: {
                    trash: true
                }
            })
            res.socket.server.io.emit(`delete:$${boardId}`, list)
            await db.auditLog.create({
                data: {
                    orgId: orgId as string,
                    entityId: list.id,
                    entityType: ENTITY_TYPE.LIST,
                    entityTitle: list.title,
                    action: ACTION.DELETE,
                    boardId: boardId as string,
                    userId: user.id,
                    userImage: user.image || "",
                    userName: user.name
                }
            });
        }
        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}





export default handler