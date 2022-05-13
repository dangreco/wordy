import Joi from "joi";
import { Entity } from "../types";
import { pagination } from "./common";

export const specific = {
  params: Joi.object().keys({
    username: Joi.string().lowercase().required(),
  })
}

export const query = {
  query: pagination(Entity.User),
}

export const followQuery = {
  query: pagination(Entity.User),
  params: Joi.object().keys({
    username: Joi.string().lowercase().required(),
  })
}

export const update = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).alphanum(),
    lastName: Joi.string().min(1).alphanum(),
    photoUrl: Joi.string().pattern(/^https\:\/\/wordyapp\.s3\.amazonaws\.com\/[0-9a-z\-]+\.[a-z]+$/i),
  }),
}

export const generatePhotoUploadUrl = {
  body: Joi.object().keys({
    mime: Joi.string().required().pattern(/^[-\w.]+\/[-\w.]+$/),
  })
}