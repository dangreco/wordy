import prisma from "../../integrations/prisma";
import { Difficulty, User } from "@prisma/client";
import { ApiError, words } from "../../utils";
import { StatusCodes } from "http-status-codes";
import { difference, sample } from "lodash";
import { PaginationOptions } from "../../types";
import { isValidWord } from "../../utils/words";

const NUM_GUESSES: Record<Difficulty, number> = {
  [Difficulty.EASY]: 6,
  [Difficulty.MEDIUM]: 6,
  [Difficulty.HARD]: 8,
  [Difficulty.INSANE]: 8,
};

export const create = async (
  difficulty: Difficulty,
  language: string,
  user?: User
) => {
  if (user) {
    
    const current = await prisma.game.findFirst({
      where: { user, complete: false },
    });

    if (current) {

      if (user.recent !== current.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            recent: current.id,
          }
        });
      }
    
      return current;  
    }

    const existing = (
      await prisma.game.findMany({
        where: { user },
        select: { word: true },
      })
    ).map(({ word }) => word);

    const wordlist = words.getWordList(language, difficulty);
    const pool = difference(wordlist, existing);
    const word = sample(pool);

    if (!word) throw new ApiError(500, 'Failed to sample word.');

    const game = await prisma.game.create({
      data: {
        word,
        difficulty,
        language,
        complete: false,
        guesses: [],
        user: {
          connect: { id: user.id },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        recent: game.id,
      },
    });

    return game;
  } else {
    throw new ApiError(500, "Not supported yet.");
  }
};

export const get = async (user: User) => {
  const games = await prisma.game.findMany({
    where: { user },
  });

  return games;
};

export const byId = async (user: User, id: string) => {
  const game = await prisma.game.findFirst({
    where: { user, id },
  });

  if (!game) throw new ApiError(StatusCodes.NOT_FOUND);

  return game;
};

export const query = async (user: User, options: PaginationOptions) => {
  const {
    cursor,
    limit,
    // reverse,
    sortBy,
  } = options;

  const games = await prisma.game.findMany({
    where: { user },
    skip: cursor ? 1 : 0,
    take: limit,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    ...(sortBy ? { orderBy: { [sortBy.field]: sortBy.direction } } : {}),
  });

  return games;
};

export const guess = async (user: User, id: string, guess: string) => {
  const game = await prisma.game.findFirst({
    where: { user, id },
  });

  if (!game) throw new ApiError(StatusCodes.NOT_FOUND);

  if (game.complete || game.guesses.length === NUM_GUESSES[game.difficulty]) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Game already complete.");
  }

  if (guess.length !== game.word.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Guess not equal to word size (${game.word.length}).`
    );
  }

  if (!isValidWord(game.language, game.difficulty, guess)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Not a valid word.`
    );
  }

  const correct = guess.toLowerCase() === game.word.toLowerCase();

  // The game is complete if the answer is correct or we have finished guessing.
  const complete = correct || game.guesses.length + 1 === NUM_GUESSES[game.difficulty];
    

  return await prisma.game.update({
    where: { id },
    data: {
      complete,
      correct,
      guesses: [...game.guesses, guess.toLowerCase()],
    },
  });
};
