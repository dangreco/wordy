import { Difficulty } from "@prisma/client";
import Joi from "joi";
import { Entity } from "../types";
import { pagination } from "./common";

export const guess = {
  body: Joi.object().keys({
    guess: Joi.string().required(),
  }),
  params: Joi.object().keys({
    gameId: Joi.string().required(),
  })
}

export const byId = {
  params: Joi.object().keys({
    gameId: Joi.string().required(),
  })
}

export const query = {
  query: pagination(Entity.Game),
}

export const create = {
  body: Joi.object().keys({
    difficulty: Joi.string().allow(...Object.values(Difficulty)),
  })
}