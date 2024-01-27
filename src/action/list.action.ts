"use server"

import { copyListRequest, copyListValidator, createListRequest, createListValidator, removeListRequest, removeListValidator, updateListRequest, updateListValidator, updateOrderListRequest } from "@/lib/Validator/list.validator"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createActivity } from "./activity.action"
import { ACTION, ENTITY_TYPE, Role } from "@prisma/client"
import { getUser } from "./user.action"


export const createList = async ({ ...data }: createListRequest) => {
    try {
        const { title, boardId, orgId } = createListValidator.parse(data)
        const board = await db.board.findUnique({
            where: {
                id: boardId
            }
        })
        if (!board) return { success: false, message: "Board not exists" }
        const lastList = await db.list.findFirst({
            where: { boardId: board.id, },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        const newOrder = lastList ? lastList.order + 1 : 1
        const list = await db.list.create({
            data: {
                title,
                boardId,
                organizationId: orgId,
                order: newOrder
            }
        })
        await createActivity({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
            orgId,
            boardId
        })
        return { success: true, message: "Board created successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const updateList = async ({ ...data }: updateListRequest & { path: string }) => {
    try {
        const { listId, title, orgId, boardId } = updateListValidator.parse(data);

        const list = await db.list.findUnique({
            where: { id: listId }
        })
        if (!list) return { message: "List not exist", success: false }
        await db.list.update({
            where: { id: list.id },
            data: { title }
        })
        await createActivity({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE,
            orgId,
            boardId
        })
        revalidatePath(data.path)
        return { message: "List updated", success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const copyList = async ({ ...data }: copyListRequest) => {
    try {
        const { listId, orgId, boardId, path } = copyListValidator.parse(data)
        const listCopy = await db.list.findUnique({
            where: {
                id: listId,
                boardId,
                board: {
                    organizationId: orgId
                }
            },
            include: { cards: true }
        })
        if (!listCopy) return { message: "Not List found", success: false }
        const lastList = await db.list.findFirst({
            where: { id: listId },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        const newOrder = lastList ? lastList.order + 1 : 1
        const list = await db.list.create({
            data: {
                boardId,
                title: `${listCopy.title} - Copy`,
                order: newOrder,
                organizationId: orgId,
                cards: {
                    createMany: {
                        data: listCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order
                        }))

                    }
                },
            },
            include: { cards: true }
        }
        )
        await createActivity({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
            orgId,
            boardId
        })
        revalidatePath(path)
        return { message: "copied", sussess: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const updateListOrder = async ({ ...data }: updateOrderListRequest) => {
    try {
        const { boardId, items } = data;
        console.log(items)
        const transaction =await items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                },
                data: {
                    order: list.order,
                },
            })
        );
        await items.map(async (list) => {
            await db.list.update({
                where: {
                    id: list.id,
                },
                data: {
                    order: list.order,
                },
            })
        })
        await db.$transaction(transaction);
        return { message: "updated", sussess: true }
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const trashList = async ({ ...data }: removeListRequest) => {
    try {
        const { listId, } = removeListValidator.parse(data)
        const list = await db.list.findUnique({
            where: { id: listId },
            include: {
                board: {
                    include: {
                        organization: true
                    }
                }
            }
        })
        if (!list) return { success: false, message: "list not found" }
        const { user, success, message } = await getUser()
        if (!success) return { success: false, message: "Unauthorized" }
        const member = await db.member.findFirst({
            where: {
                userId: user?.id,
                organizationId: list.board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.list.update({
            where: {
                id: listId
            },
            data: {
                trash: true
            }
        })
        return { success: true, message: "Moved To trash" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const restoreList = async ({ ...data }: removeListRequest) => {
    try {
        const { listId, orgId } = removeListValidator.parse(data)
        const list = await db.list.findUnique({
            where: { id: listId },
            include: {
                board: {
                    include: {
                        organization: true
                    }
                }
            }
        })
        if (!list) return { success: false, message: "list not found" }
        const { user, success, message } = await getUser()
        if (!success) return { success: false, message: "Unauthorized" }
        const member = await db.member.findFirst({
            where: {
                userId: user?.id,
                organizationId: list.board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.list.update({
            where: {
                id: listId,
                trash: true
            },
            data: {
                trash: false
            }
        })
        await createActivity({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.RESTORED,
            orgId,
            boardId: list.boardId
        })
        return { success: true, message: "Restored" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}
export const deleteList = async ({...data}:removeListRequest) => {
    try {
        const { listId, orgId} = removeListValidator.parse(data)
        const list = await db.list.findUnique({
            where: { id: listId },
            include: {
                board: {
                    include: {
                        organization: true
                    }
                }
            }
        })
        if (!list) return { success: false, message: "list not found" }
        const { user, success, message } = await getUser()
        if (!success) return { success: false, message: "Unauthorized" }
        const member = await db.member.findFirst({
            where: {
                userId: user?.id,
                organizationId: list.board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.list.update({
            where: {
                id: listId,
                trash: true
            },
            data: {
                trash: false
            }
        })
        await createActivity({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE,
            orgId
        })
        return { success: true, message: "Restored" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}