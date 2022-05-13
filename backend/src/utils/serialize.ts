import {
  User, Token, Game,
} from "@prisma/client";
import { pick } from "lodash";
import { calculateHint } from "./hints";

const isUser = (data: any): data is User => (data as User).email !== undefined;
const isToken = (data: any): data is Token => (data as Token).type !== undefined;
const isGame = (data: any): data is Game => (data as Game).word !== undefined;

const serializeUser = (user: User, owner?: boolean) => ({
  ...pick(user, [
    'id',
    'username',
    'firstName',
    'lastName',
    'photoUrl',
    'photoBlurHash',
    ...(
      owner ? [
        'recent'
      ] : []
    )
  ]),
  ...(
    // @ts-ignore
    user._count ? { following: user._count.follows, followers: user._count.followedBy } : {}
  )
});

const serializeToken = (_token: Token, _owner?: boolean) => { throw new Error('Should not be serializing token.'); }

const serializeGame = (game: Game, owner?: boolean) => ({
  ...pick(game, [
    'id',
    'createdAt',
    'updatedAt',
    'size',
    'complete',
    'difficulty',
    ...(
      owner ? [
      ] : []
    )
  ]),
  size: game.word.length,
  guesses: game.guesses.map(
    (guess) => ({
      guess,
      hint: calculateHint(game.word, guess),
    })
  ),
  ...(
    game.complete ? {
      word: game.word,
    } : { }
  )
})

const serialize = (
  data: any,
  owner?: boolean,
) => {
  if (isUser(data)) return serializeUser(data as User, owner);
  if (isGame(data)) return serializeGame(data as Game, owner);
  if (isToken(data)) return serializeToken(data as Token, owner);

  throw new Error('Attempting to serialize something that should not be serialized.');
};

export default serialize;