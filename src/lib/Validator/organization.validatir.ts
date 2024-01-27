import { z } from "zod";


export const createOrganization = z.object({
    name: z.string().min(3, "Name should be minimum 3 charachers").max(20, "Name should be maximum 20 charachers")
})
export type CreateOrgRequest = z.infer<typeof createOrganization>


export const updateOrganization = z.object({
    name: z.string().min(3, "Name should be minimum 3 charachers").max(20, "Name should be maximum 20 charachers"),
    id: z.string()
})
export type UpdateOrganization = z.infer<typeof updateOrganization>


export const leaveOrganizationValidator = z.object({
    orgId: z.string({required_error:"Organization Id is required"}),
    memberId: z.string({required_error:"Organization Id is required"})
})
export type LeaveOrganization = z.infer<typeof leaveOrganizationValidator>


export type ROLE = {
    ADMIN: "ADMIN"
    MEMBER: "MEMBER"
}