"use server"
import { CardValidatorrequest, DeleteCardValidatorrequest, UpdateCardOrderRequest, UpdateCardOrderValidator, UpdateCardValidatorrequest, createCardValidator, deleteCardValidator, updateCardValidator } from "@/lib/Validator/card.validator";
import { db } from "@/lib/db";
import { z } from "zod";
import { createActivity } from "./activity.action";
import { ACTION, ENTITY_TYPE, Role } from "@prisma/client";
import { getUser } from "./user.action";



export const createCard = async ({ ...data }: CardValidatorrequest) => {
    try {
        const { title, listId, orgId, boardId } = createCardValidator.parse(data)
        const list = await db.list.findUnique({
            where: { id: listId }
        })

        if (!list) return { message: "list not found", success: false }
        const preOrder = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: { createdAt: "desc" },
            select: { order: true }
        })
        const newOrder = preOrder ? preOrder.order + 1 : 1
        const card = await db.card.create({
            data: {
                listId,
                title,
                order: newOrder
            }
        })
        await createActivity({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
            orgId,
            boardId
        })
        return { message: "card created", success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const updateCard = async ({ ...data }: UpdateCardValidatorrequest) => {
    try {
        const { cardId, description, orgId, boardId } = updateCardValidator.parse(data)
        const existCard = await db.card.findUnique({
            where: {
                id: cardId
            }
        })
        if (!existCard) return { success: false, message: "card not found" }
        const card = await db.card.update({
            where: { id: cardId },
            data: { description }
        })
        await createActivity({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
            orgId,
            boardId
        })
        return { message: "card updated", success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}
export const deleteCard = async ({ ...data }: DeleteCardValidatorrequest) => {
    try {
        const { cardId, orgId, boardId } = deleteCardValidator.parse(data)
        const { user, success } = await getUser()
        if (!user || !success) return { success: false, message: "User not found" }
        const member = await db.member.findFirst({
            where: {
                userId: user.id,
                organizationId: orgId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        const existCard = await db.card.findUnique({
            where: {
                id: cardId
            }
        })
        if (member.role === Role.MEMBER) return { success: true, message: "Member not allowed" }
        if (!existCard) return { success: false, message: "card not found" }
        const card = await db.card.delete({
            where: { id: cardId },
        })
        await createActivity({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE,
            orgId,
            boardId
        })
        return { message: "card updated", success: true }
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const updateCardOrder = async ({ ...data }: UpdateCardOrderRequest) => {
    try {
        const { items, boardId, orgId } = UpdateCardOrderValidator.parse(data)
        const transaction = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            organizationId: orgId
                        },
                    },
                },
                data: {
                    order: card.order,
                    listId: card.listId,
                },
            }),
        );

        await db.$transaction(transaction);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}