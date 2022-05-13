import {   TokenType, User } from "@prisma/client";
import { jwt, prisma } from "../../integrations";
import ApiError from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const create = async (
  user: User,
  type: TokenType
): Promise<string> => {
  await purge(user, type);
  const { token } = await prisma.token.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      type,
      token: jwt.createToken(user, type),
    }
  });

  return token;
}

export const createAuthPair = async (
  user: User,
) => ({
  access: await create(user, TokenType.ACCESS),
  refresh: await create(user, TokenType.REFRESH),
})

export const purge = async (
  user: User,
  type: TokenType,
) => {
  await prisma.token.deleteMany({
    where: { user, type }
  });
}

export const verify = async (
  token: string,
  type: TokenType,
) => {
  const _token = prisma.token.findFirst({
    where: { token, type }
  });

  if (!_token || !jwt.verifyToken(token)) {
    throw new ApiError(StatusCodes.UNAUTHORIZED);
  }

  return _token.user();
}