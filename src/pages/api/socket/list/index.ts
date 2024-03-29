import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../io";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken"
import { ACTION, ENTITY_TYPE } from "@prisma/client";




const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        const { title } = req.body
        const { boardId, orgId } = req.query
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
        const board = await db.board.findUnique({
            where: {
                id: boardId as string
            }
        })
        if (!board) return res.status(404).json({ message: "Board not found" })
        const lastList = await db.list.findFirst({
            where: { boardId: board.id, },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        const newOrder = lastList ? lastList.order + 1 : 1
        const list = await db.list.create({
            data: {
                title,
                boardId: boardId as string,
                organizationId: orgId as string,
                order: newOrder
            },
            include: {
                cards: true
            }
        })
        res.socket.server.io.emit(`create:$${boardId}`, list)
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
        res.status(200).json({ message: "Board created successfully" })

    } catch (error) {
        res.status(500).json({ message: "something went wrong" })

    }
}


export default handler