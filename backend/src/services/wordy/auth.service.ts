import { wordy } from '../../services';
import { LoginInput, RegisterInput } from "../../types";
import { hash, verify } from 'argon2';
import ApiError from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { User } from '@prisma/client';

export const register = async (data: RegisterInput) => {  
  const hashed = await hash(data.password);

  const user = await wordy.user.create({
    ...data,
    password: hashed,
  });

  const auth = await wordy.token.createAuthPair(user);

  return {
    user,
    auth,
  }
};

export const login = async (data: LoginInput) => {  
  const user = await wordy.user.byUsername(data.username);

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND, 
      `User with username ${data.username} does not exist.`
    );
  }

  if (!(await verify(user?.password, data.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password does not match.');
  }

  const auth = await wordy.token.createAuthPair(user);

  return {
    user,
    auth,
  }
};

export const refresh = async (user: User) => {
  const auth = await wordy.token.createAuthPair(user);

  return auth;
}
