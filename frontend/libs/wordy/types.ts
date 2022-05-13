export enum Method { 
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type GuessInput = {
  guess: string;
}

export type GameCreateInput = {
  difficulty: Wordy.Difficulty;
}

export type PhotoStageInput = {

}

export type UpdateInput = {
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
}

export enum Direction {
  ASC = "asc",
  DESC = "desc",
}

export type PaginationOptions = {
  cursor?: string;
  limit?: number;
  reverse?: boolean;
  sortBy?: {
    field: string;
    direction: Direction;
  };
}

export namespace Wordy {

  export type Auth = {
    access: string;
    refresh: string;
  }

  export type Language = {
    language: string;
    counts: Record<Difficulty, number>;
    total: number;
  }

  export type Progress = Record<Difficulty, { correct: number, incorrect: number }>
  export type Progression = Record<string, Progress>;

  export type Error = {
    code: number;
    message: string;
  }

  export type Response<T> = {
    auth?: Auth;
    error?: Error;
    data?: T;
  }

  export type PhotoStage = {
    url: string;
    signedUrl: string;
  }

  export type User = {
    id: string;
    username: string;
    email?: string;
    firstName: string;
    lastName: string;
    recent?: string;
    followers?: number;
    following?: number;
    photoUrl?: string;
    photoBlurHash?: string;
  };

  export type Game = {
    id: string;
    createdAt: string;
    updatedAt: string;
    size: number;
    guesses: Guess[];
    complete: boolean;
    word?: string;
    difficulty: Difficulty;
  };

  export type Guess = {
    guess: string;
    hint: number;
  };

  export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    INSANE = "INSANE",
  }

}