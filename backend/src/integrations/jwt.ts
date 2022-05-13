import { TokenType, User } from "@prisma/client";
import jwt from "jsonwebtoken";

// We want to change this.
const KEY = process.env.JWT_SECRET as string; 

const EXPIRES: Record<TokenType, string> = {
  [TokenType.ACCESS]: "30 days",
  [TokenType.REFRESH]: "1 year",
  [TokenType.RESET]: "10 minutes",
  [TokenType.VERIFY]: "10 minutes",
};

export const createToken = (user: User, type: TokenType) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    KEY,
    {
      subject: user.id,
      expiresIn: EXPIRES[type],
    }
  );

export const verifyToken = (
  token: string,
): boolean => 
{
  try {
    jwt.verify(token, KEY);
    return true;
  } catch (err) {
    return false;
  }
};