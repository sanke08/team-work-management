import { z } from "zod";



export const createCardValidator = z.object({
    title: z.string({ required_error: "Title must contain atleast 3 character" }).min(3),
    listId: z.string({ required_error: "List Id must Provided" }),
    orgId: z.string({ required_error: "Org Id must Provided"}),
    boardId: z.string({ required_error: "Org Id must Provided"}),

})

export type CardValidatorrequest = z.infer<typeof createCardValidator>

export const updateCardValidator = z.object({
    cardId: z.string({ required_error: "Card Id must Provided" }),
    orgId: z.string({ required_error: "Org Id must Provided"}),
    description: z.string().min(3,"Card description must greater than 3 characters"),
    boardId: z.string({ required_error: "Org Id must Provided"}),
})

export type UpdateCardValidatorrequest = z.infer<typeof updateCardValidator>

export const deleteCardValidator = z.object({
    cardId: z.string({ required_error: "Card Id must Provided" }),
    orgId: z.string({ required_error: "Org Id must Provided"}),
    boardId: z.string({ required_error: "Org Id must Provided"}),
})

export type DeleteCardValidatorrequest = z.infer<typeof deleteCardValidator>



export const UpdateCardOrderValidator = z.object({
  items: z.array(
      z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  boardId: z.string({required_error: "Board Id must Provided"}),
  orgId: z.string({required_error:"org Id must Provided"}),
});

export type UpdateCardOrderRequest = z.infer<typeof UpdateCardOrderValidator>