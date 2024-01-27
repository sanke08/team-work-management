import { z } from "zod"

export const removeMemberValidator = z.object({
    memberId: z.string({ required_error: "Member Id required" }),
    userId: z.string({ required_error: "User Id required" }),
    orgId: z.string({ required_error: "org Id required" })

})

export type removeMemberrequest = z.infer<typeof removeMemberValidator>



export const changeRoleValidator = z.object({
    memberId: z.string({ required_error: "Member Id required" }),
    userId: z.string({ required_error: "User Id required" }),
    orgId: z.string({ required_error: "org Id required" })
})

export type ChangeRolerequest = z.infer<typeof changeRoleValidator>
