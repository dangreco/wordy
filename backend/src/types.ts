export interface UserInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type UserUpdateInput = Partial<Pick<UserInput, 'firstName' | 'lastName'>> & {
  photoUrl?: string;
}

export type RegisterInput = UserInput;
export type LoginInput = Pick<UserInput, 'username' | 'password'>;

export enum Entity {
  User,
  Game,
  Token,
}

export enum Direction {
  ASC = "asc",
  DESC = "desc",
}

export type PaginationOptions = {
  cursor?: string;
  limit: number;
  reverse: boolean;
  sortBy?: {
    field: string;
    direction: Direction;
  };
}