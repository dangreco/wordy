import Joi, { Schema } from "joi";
import { Direction, Entity } from "../types";

const BasePagination = Joi.object().keys({
  cursor: Joi.string(),
  limit: Joi.number().integer().min(1).max(50).default(25),
  reverse: Joi.boolean().default(false),
});

const SortBy = (...fields: string[]) => Joi.object().keys({
  field: Joi.string().allow(...fields),
  direction: Joi.string().allow(Direction.ASC, Direction.DESC)
});

const PAGINATIONS: Record<Entity, Schema | undefined> = {
  [Entity.User]: BasePagination,
  [Entity.Token]: undefined,
  [Entity.Game]: BasePagination.append({
    sortBy: SortBy('createdAt', 'updatedAt', 'difficulty').default({
      field: 'createdAt',
      direction: 'desc',
    })
  }),
}

export const pagination = (entity: Entity) => {
  const schema = PAGINATIONS[entity];

  return schema || Joi.forbidden();
}
