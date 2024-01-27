"use server"
import { LoginValidator, RegisterValidator } from "@/lib/Validator/auth.validator";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { z } from "zod";
import { ACTION, ENTITY_TYPE, Role } from "@prisma/client";
import { ChangeRolerequest, changeRoleValidator, removeMemberValidator, removeMemberrequest } from "@/lib/Validator/member.validator";
import { createActivity } from "./activity.action";



export const LoginAction = async ({ ...payload }) => {
    try {
        const { email, password } = LoginValidator.parse(payload)
        if (!email || !password) return { message: "Please provide all required information", success: false }
        const existUser = await db.user.findFirst({
            where: { email }
        })
        if (!existUser) return { message: "Invalid Credentials", success: false }
        const matchPassword = await bcryptjs.compare(password, existUser.password)
        if (!matchPassword) return { message: "Invalid Credentials", success: false }
        const token = jwt.sign({ id: existUser.id }, process.env.SECRETE_TOKEN!)
        const cookieStore = cookies()
        await cookieStore.set("trello_auth_token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
        return { success: true, message: "Login successful" }
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "Something went wrong " }
    }
}

export const RegisterAction = async ({ ...payload }) => {
    try {
        const { email, password, name } = RegisterValidator.parse(payload)
        if (!email || !password) return { message: "Please provide all required information", success: false }
        const existUser = await db.user.findFirst({
            where: { email }
        })
        if (existUser) return { message: "Already Exist", success: false }
        const hashPassword = await bcryptjs.hash(password, 14)
        const user = await db.user.create({
            data: {
                email, name, password: hashPassword
            }
        })
        const randomNumber: number = Math.floor(Math.random() * 1000000)
        const link = await jwt.sign({ randomNumber }, process.env.SECRETE_TOKEN!)
        const org = await db.organization.create({
            data: {
                name: "General",
                creatorId: user.id, 
                link
            }
        })
        await db.member.create({
            data: {
                userId: user.id,
                organizationId: org.id,
                role: "ADMIN"
            }
        })
        const token = await jwt.sign({ id: user.id }, process.env.SECRETE_TOKEN!)
        const cookieStore = cookies()
        cookieStore.set("trello_auth_token", token)
        return { success: true, message: "Login successful" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const logout = async () => {
    try {
        const cookieStore = cookies()
        cookieStore.delete("trello_auth_token")
        return { success: true }
    } catch (error) {
        return { success: false }
    }
}


export const getUser = async () => {
    const cookieStore = cookies()
    const token = cookieStore.get("trello_auth_token")?.value || ""
    if (!token) return { success: false, message: "Unauthorized" }
    // @ts-ignore
    const id = jwt.verify(token, process.env.SECRETE_TOKEN!).id
    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        })
        if (!user) return { success: false, message: "User not found" }
        return { success: true, message: "user found", user }
    } catch (error) {
        return { success: false, message: "Something went wrong" }
    }
}

export const createMember = async ({ userId, orgId }: { userId: string, orgId: string }) => {
    try {
        if (!userId || !orgId) return { success: false, message: "Provide all fields" }
        const exist = await db.member.findFirst({
            where: {
                userId,
                organizationId: orgId
            }
        })
        if (exist) return { success: true }
        const member = await db.member.create({
            data: {
                userId: userId,
                role: Role.MEMBER,
                organizationId: orgId
            },
            include: { user: true }
        })
        await createActivity({
            orgId,
            entityType: ENTITY_TYPE.MEMBER,
            entityTitle: member.user.name,
            entityId: member.id,
            action: ACTION.JOINED
        })
        return { success: true, message: "created success", }
    } catch (error) {
        return { success: false, message: "Something went wrong" }
    }
}

export const removeMember = async (payload: removeMemberrequest) => {
    try {
        const { memberId, userId, orgId } = removeMemberValidator.parse(payload)
        const existMember = await db.member.findUnique({
            where: {
                id: memberId
            }
        })
        if (!existMember) return { success: false, message: "Member not found" }
        const org = await db.organization.findUnique({
            where: {
                id: orgId
            }
        })
        if (!org) return { success: false, message: "Organization not found" }
        const isAdmin = await db.member.findFirst({
            where: {
                userId,
                organizationId: org.id,
            }
        })
        if (isAdmin?.role === Role.MEMBER) return { success: false, message: "You arew Not admin" }
        const member = await db.member.delete({
            where: {
                id: memberId
            }, include: { user: true }
        })
        await createActivity({
            orgId,
            entityType: ENTITY_TYPE.MEMBER,
            entityTitle: member.user.name,
            entityId: member.id,
            action: ACTION.REMOVE
        })
        return { success: true, message: "Member Removed" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const changeRole = async (payload: ChangeRolerequest) => {
    try {
        const { memberId, userId, orgId } = changeRoleValidator.parse(payload)
        const org = await db.organization.findUnique({
            where: { id: orgId }
        })
        if (!org) return { success: false, message: "Organization not found" }
        const member = await db.member.findUnique({
            where: { id: memberId },
            include: { user: true }
        })
        if (!member) return { success: false, message: "Member not found" }
        const user = await db.member.findUnique({
            where: { id: userId }
        })
        if (!user) return { success: false, message: "user not found" }
        if (user.role === Role.MEMBER) return { success: false, message: "You Are Not Admin" }
        if (member.role === Role.ADMIN) {
            await db.member.update({
                where: { id: member.id },
                data: { role: Role.MEMBER }
            })
        } else {
            await db.member.update({
                where: { id: member.id },
                data: { role: Role.ADMIN }
            })
        }
        await createActivity({
            orgId,
            entityType: ENTITY_TYPE.MEMBER,
            entityTitle: member.user.name,
            entityId: member.id,
            action: ACTION.ROLE_CHANGED
        })
        return { success: true, message: "RoleUpdated Succefully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}