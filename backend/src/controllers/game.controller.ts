import { wordy } from "../services";
import { respond, serialize } from "../utils";
import { Context } from "koa";

export const create = async (ctx: Context) => {
  const { difficulty } = ctx.validated.body;

  const game = await wordy.game.create(
    difficulty,
    ctx.language || 'English',
    ctx.user,
  );

  respond(
    ctx, 
    serialize(game, true), 
  );
}

export const myGames = async (ctx: Context) => {
  const options = ctx.validated.query;

  const games = await wordy.game.query(
    ctx.user,
    options,
  );

  respond(
    ctx, 
    games.map((game) => serialize(game, true)), 
  );
}

export const byId = async (ctx: Context) => {
  const {
    params: {
      gameId,
    },
  } = ctx.validated;

  const game = await wordy.game.byId(
    ctx.user,
    gameId,
  );

  respond(
    ctx, 
    serialize(game, true), 
  );
}

export const guess = async (ctx: Context) => {
  const {
    body: {
      guess,
    },
    params: {
      gameId,
    },
  } = ctx.validated;

  const game = await wordy.game.guess(
    ctx.user,
    gameId,
    guess,
  );

  respond(
    ctx, 
    serialize(game, true), 
  );
}