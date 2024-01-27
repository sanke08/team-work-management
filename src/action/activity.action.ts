"use server"
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { getUser } from "./user.action";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE,
    entityTitle: string;
    action: ACTION;
    orgId: string;
    boardId?: string
};

export const createActivity = async ({ orgId, entityId, boardId, entityTitle, entityType, action }: Props) => {
    try {
        const { user, message } = await getUser()

        if (!user || !orgId) {
            throw new Error("User not found!");
        }
        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                boardId: boardId || "",
                userId: user.id,
                userImage: user.image || "",
                userName: user.name
            }
        });
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
}