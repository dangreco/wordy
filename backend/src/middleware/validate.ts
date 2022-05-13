import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Context, Next } from "koa";
import { pick } from 'lodash';

type Validator = {
  body?: Joi.Schema;
  params?: Joi.Schema;
  query?: Joi.Schema;
}

const validate = (
  validator: Validator,
) => async (ctx: Context, next: Next) => {
  const input: Record<string, any> = pick(ctx.request, ['body', 'params', 'query']);
  ctx.validated = {};

  Object.entries(validator).forEach(
    ([loc, schema]) => {
      const result = schema.validate(input[loc] || {});
      
      if (result.error) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          result.error.message,
        )
      } else {
        ctx.validated[loc] = result.value;
      }
    }
  );

  await next();
}

export default validate;