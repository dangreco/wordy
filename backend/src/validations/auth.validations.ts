import Joi from "joi";

export const register = {
  body: Joi.object().keys({
    username: Joi.string().min(2).lowercase().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(1).alphanum().required(),
    lastName: Joi.string().min(1).alphanum().required(),
  }),
}

export const login = {
  body: Joi.object().keys({
    username: Joi.string().min(2).lowercase().required(),
    password: Joi.string().min(8).required(),
  }),
}