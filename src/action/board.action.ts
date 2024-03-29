"use server"

import { createBoardRequest, createBoardValidator, removeBoardRequest, removeBoardValidator, updateBoardRequest, updateBoardValidator } from "@/lib/Validator/board.validator"
import { db } from "@/lib/db"
import { z } from "zod"
import { createActivity } from "./activity.action"
import { ACTION, ENTITY_TYPE, Role } from "@prisma/client"



export const getBoard = async (name: string) => {
    try {
        const boards = await db.board.findMany({
            where: {
                title: {
                    startsWith: name
                }
            }
        })
        return boards
    } catch (error) {
        return null
    }
}

export const createBoard = async ({ ...data }: createBoardRequest) => {
    try {
        const { title, organizationId } = createBoardValidator.parse(data)
        const existBoard = await db.board.findFirst({
            where: {
                title
            }
        })
        if (existBoard) return { success: false, message: "Board already exists" }
        const board = await db.board.create({
            data: {
                title,
                organizationId,
            }
        })
        await createActivity({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
            orgId: organizationId
        })
        return { success: true, message: "Board created successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const updateBoard = async ({ ...data }: updateBoardRequest) => {
    try {
        const { id, title, imgurl } = updateBoardValidator.parse(data)
        const existBoard = await db.board.findUnique({
            where: { id }
        })
        if (!existBoard) return { success: false, message: "something went wrong please try again" }
        const board = await db.board.update({
            where: { id }, data: { title, imageFullUrl: imgurl ? imgurl : existBoard.imageFullUrl }
        })


        await createActivity({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
            orgId: board.organizationId
        })
        return { success: true, message: "Updated Successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const trashBoard = async ({ ...data }: removeBoardRequest) => {
    try {
        const { boardId, memberId, orgId } = removeBoardValidator.parse(data)
        const board = await db.board.findUnique({
            where: { id: boardId }
        })
        if (!board) return { success: false, message: "board not found" }
        const member = await db.member.findUnique({
            where: {
                id: memberId,
                organizationId: board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.board.update({
            where: {
                id: boardId
            },
            data: {
                trash: true
            }
        })
        await createActivity({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.TRASHED,
            orgId
        })
        return { success: true, message: "Moved To trash" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const restoreBoard = async ({ ...data }: removeBoardRequest) => {
    try {
        const { boardId, memberId, orgId } = removeBoardValidator.parse(data)
        const board = await db.board.findUnique({
            where: { id: boardId }
        })
        if (!board) return { success: false, message: "board not found" }
        const member = await db.member.findUnique({
            where: {
                id: memberId,
                organizationId: board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.board.update({
            where: {
                id: boardId,
                trash: true
            },
            data: {
                trash: false
            }
        })
        await createActivity({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.RESTORED,
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

export const deleteBoard = async ({ ...data }: removeBoardRequest) => {
    try {
        const { boardId, memberId, orgId } = removeBoardValidator.parse(data)
        const board = await db.board.findUnique({
            where: { id: boardId }
        })
        if (!board) return { success: false, message: "board not found" }
        const member = await db.member.findUnique({
            where: {
                id: memberId,
                organizationId: board.organizationId
            }
        })
        if (!member) return { success: false, message: "member not found" }
        if (member.role === Role.MEMBER) return { success: false, message: "Member Not allowed to delete board" }
        await db.board.delete({
            where: {
                id: boardId
            }
        })
        await createActivity({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
            orgId
        })
        return { success: true, message: "Deleted" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}