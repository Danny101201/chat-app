import Joi from "joi";

type ValidationAddMessageInput = {
  messsage: string;
  from: string;
  to: string;
}
export const validationAddMessage = (date: ValidationAddMessageInput) => {
  const schema = Joi.object({
    message: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
  })
  return schema.validate(date)
}