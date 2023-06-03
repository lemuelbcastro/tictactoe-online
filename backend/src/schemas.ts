import { ObjectSchema, number, object, string } from "yup";

import { CREATE, MOVE } from "./constants";
import { Message } from "./types";

export const messageSchema: ObjectSchema<Message> = object({
  type: string().required(),
  payload: object({
    roomId: string().required(),
    boardIndex: number().optional(),
  })
    .when("type", {
      is: (type: string) => type === CREATE,
      then: (schema) => schema.default(undefined),
    })
    .when("type", {
      is: (type: string) => type === MOVE,
      then: (schema) =>
        schema.shape({
          roomId: string().required(),
          boardIndex: number().min(0).max(9).required(),
        }),
    }),
});
