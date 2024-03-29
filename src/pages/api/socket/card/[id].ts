import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../io";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken"
import { ACTION, ENTITY_TYPE, Role } from "@prisma/client";





 const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        const { cardId, orgId, boardId } = req.query
        const { description } = req.body
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
        const existCard = await db.card.findUnique({
            where: {
                id: cardId as string
            }
        })
        if (!existCard)  res.status(404).json({ message: "card not found" })
        if (req.method === "PUT") {
            const card = await db.card.update({
                where: { id: cardId as string },
                data: { description },
                include: {
                    list: true
                }
            })
            console.log(card)
            res.socket.server.io.emit(`update:${card.list.id}`, card)
            await db.auditLog.create({
                data: {
                    orgId: orgId as string,
                    entityId: card.id,
                    entityType: ENTITY_TYPE.CARD,
                    entityTitle: card.title,
                    action: ACTION.UPDATE,
                    boardId: boardId as string,
                    userId: user.id,
                    userImage: user.image || "",
                    userName: user.name
                }
            });
        }
        if (req.method === "DELETE") {
            const member = await db.member.findFirst({
                where: {
                    userId: user.id,
                    organizationId: orgId as string,
                    role: Role.ADMIN
                }
            })
            if (!member) return res.json({message:"Member not found"})
            const card = await db.card.delete({
                where: { id: cardId as string },
                include: { list: true }
            })
            res.socket.server.io.emit(`delete:${card.list.id}`, card)
            await db.auditLog.create({
                data: {
                    orgId: orgId as string,
                    entityId: card.id,
                    entityType: ENTITY_TYPE.CARD,
                    entityTitle: card.title,
                    action: ACTION.DELETE,
                    boardId: boardId as string,
                    userId: user.id,
                    userImage: user.image || "",
                    userName: user.name
                }
            });
        }
       return res.status(200).json({ message: "success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}



export default handler