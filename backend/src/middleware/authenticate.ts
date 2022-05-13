import { TokenType } from "@prisma/client";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Context, Next } from "koa";
import { wordy } from "../services";

const BEARER = /^Bearer [a-zA-Z0-9-_.]+$/;

const authenticate = (type?: TokenType) => async (
  ctx: Context, 
  next: Next
) => {
  const authorization = ctx.request.headers.authorization;

  if (!authorization || !BEARER.test(authorization)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Please authenticate.');
  } 

  const token = authorization.substring(7);

  const user = await wordy.token.verify(token, type || TokenType.ACCESS);

  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED);

  ctx.user = user;
  
  await next();
};

export default authenticate;