import { z } from "zod";



export const createBoardValidator = z.object({
    title: z.string({ required_error: "Title Required" }).min(3, "Title must  contain at least 3 character(s)").max(15, "Title contain maximum 3 character(s)"),
    organizationId: z.string({ required_error: "Organization id required" })
})
export type createBoardRequest = z.infer<typeof createBoardValidator>

export const updateBoardValidator = z.object({
    id: z.string({ required_error: "id Not Found" }),
    title: z.string({ required_error: "Title Required" }).min(3, "Title must  contain at least 3 character(s)").max(15, "Title contain maximum 3 character(s)"),

})
export type updateBoardRequest = z.infer<typeof updateBoardValidator>

export const removeBoardValidator = z.object({
    boardId: z.string({ required_error: "board Id Required" }),
    memberId: z.string({ required_error: "member Id Required" }),
    orgId: z.string({ required_error: "Organization id required" })
})
export type removeBoardRequest = z.infer<typeof removeBoardValidator>
