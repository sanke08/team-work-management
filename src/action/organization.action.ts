"use server"

import { CreateOrgRequest, LeaveOrganization, UpdateOrganization, createOrganization, leaveOrganizationValidator, updateOrganization } from "@/lib/Validator/organization.validatir"
import { getUser } from "./user.action"
import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Role } from "@prisma/client"

export const createOrgAction = async ({ ...data }: CreateOrgRequest) => {
    try {
        const { name } = createOrganization.parse(data)
        const { user, message, success } = await getUser()
        if (!user || !success) return { message }
        const org = await db.organization.findFirst({
            where: {
                name
            }
        })
        if (org) return { message: "Organization already exists please choose other name", success: false }
        const randomNumber: number = Math.floor(Math.random() * 1000000)
        const link = jwt.sign({ randomNumber }, process.env.SECRETE_TOKEN!)
        const newOrg = await db.organization.create({
            data: {
                name,
                creatorId: user.id,
                link
            }
        })
        await db.member.create({
            data: {
                userId: user.id,
                role: Role.ADMIN,
                organizationId: newOrg.id
            }
        })
        return { success: true, message: "Organization created successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}

export const getOrganizations = async () => {
    try {
        const { user, message, success } = await getUser()
        if (!user || !success) return { message }
        const members = await db.member.findMany({
            where: {
                userId: user.id
            },
            include: {
                Organization: true
            }
        })
        const orgs = members.map(({ Organization }) => {
            return Organization
        })
        return { organizations: orgs }
    } catch (error) {
        return { success: false, message: "something went wrong" }
    }
}


export const updateOrganizaton = async ({ ...data }: UpdateOrganization) => {
    try {
        const { name, id } = updateOrganization.parse(data);
        const org = await db.organization.findUnique({
            where: { id }
        })
        if (!org) return { success: false, message: "Organization not found with id", id }
        await db.organization.update({
            where: {
                id
            },
            data: {
                name
            }
        })
        return { success: true, message: "Organization updated successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}


export const generateInviteLink = async ({ orgId }: { orgId: string }) => {
    try {
        const org = await db.organization.findUnique({
            where: { id: orgId }
        })
        if (!org) return { success: false, message: "Organization not found with id" }
        const randomNumber: number = Math.floor(Math.random() * 1000000)
        const link = await jwt.sign({ randomNumber }, process.env.SECRETE_TOKEN!)
        await db.organization.update({
            where: { id: orgId },
            data: { link }
        })
        return { success: true, message: "Organization link generated successfully" }
    } catch (error) {
        return { success: false, message: "something went wrong" }
    }
}

export const leaveOrganization = async ({ ...data }: LeaveOrganization) => {
    try {
        const { orgId, memberId } = leaveOrganizationValidator.parse(data)
        const existMember = await db.member.findUnique({
            where: {
                id: memberId
            }
        })
        if (!existMember) return { success: false, message: "Member not found" }
        const organization = await db.organization.findUnique({
            where: {
                id: orgId
            }
        })
        if (!organization) return { success: false, message: "Organization not found" }
        if (organization.creatorId === existMember.userId) return { success: false, message: "Creator cannot leave organization" }
        await db.member.delete({
            where: {
                id: existMember.id
            }
        })
        return { success: true, message: "Member Deleted successfully" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message }
        }
        return { success: false, message: "something went wrong" }
    }
}