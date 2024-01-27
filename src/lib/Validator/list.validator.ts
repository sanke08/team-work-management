import { any, z } from "zod";


export const createListValidator = z.object({
    title: z.string({ required_error: "Title Required" }).min(3, "Title must  contain at least 3 character(s)").max(15, "Title contain maximum 15 character(s)"),
    boardId: z.string({ required_error: "Board Id Required" }),
    orgId: z.string({ required_error: "Org Id must Provided" }),
})
export type createListRequest = z.infer<typeof createListValidator>


export const updateListValidator = z.object({
    title: z.string({ required_error: "Title Required" }).min(3, "Title must  contain at least 3 character(s)").max(15, "Title contain maximum 15 character(s)"),
    listId: z.string({ required_error: "List Id Required" }),
    orgId: z.string({ required_error: "Org Id must Provided" }),
    boardId: z.string({ required_error: "Board Id Required" }),

})
export type updateListRequest = z.infer<typeof updateListValidator>

export const copyListValidator = z.object({
    listId: z.string({ required_error: "List Id Required" }),
    boardId: z.string({ required_error: "Board Id Required" }),
    orgId: z.string({ required_error: "Org Id must Provided" }),
    path: any()

})
export type copyListRequest = z.infer<typeof copyListValidator>


export const updateOrderListValidator = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    ),
    boardId: z.string(),
});
export type updateOrderListRequest = z.infer<typeof updateOrderListValidator>

export const removeListValidator = z.object({
    listId: z.string({ required_error: "list Id Required" }),
    orgId:z.string({ required_error: "Org Id Required" }),
})
export type removeListRequest = z.infer<typeof removeListValidator>
