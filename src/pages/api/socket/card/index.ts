import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "../io"
import { db } from "@/lib/db"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import jwt from "jsonwebtoken"



const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        const { title } = req.body
        const { listId, orgId, boardId } = req.query
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

        if (!list) return { message: "list not found", success: false }
        const preOrder = await db.card.findFirst({
            where: {
                listId: listId as string
            },
            orderBy: { createdAt: "desc" },
            select: { order: true }
        })
        const newOrder = preOrder ? preOrder.order + 1 : 1
        const card = await db.card.create({
            data: {
                listId: listId as string,
                title,
                order: newOrder
            }
        })
        await db.auditLog.create({
            data: {
                orgId: orgId as string,
                entityId: card.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: card.title,
                action: ACTION.CREATE,
                boardId: boardId as string,
                userId: user.id,
                userImage: user.image || "",
                userName: user.name
            }
        });
        res.socket.server.io.emit(`create:${list.id}`, card)
        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: "success" })
    }
}

export default handler