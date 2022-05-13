import { authenticate, validate } from "../middleware";
import { 
  user as userController,
  game as gameController,
} from '../controllers';
import {
  user as userValidator,
  game as gameValidator, 
} from '../validations';
import compose from "koa-compose";
import Router from "@koa/router";

const router = new Router();

router
  .get(
    '/me', 
    compose([
      authenticate(),
      userController.me,
    ])
  )
  .put(
    '/me',
    compose([
      validate(userValidator.update),
      authenticate(),
      userController.update,
    ])
  )
  .post(
    '/me/photo',
    compose([
      validate(userValidator.generatePhotoUploadUrl),
      authenticate(),
      userController.generatePhotoUploadUrl,
    ])
  )
  .get(
    '/me/games',
    compose([
      validate(gameValidator.query),
      authenticate(),
      gameController.myGames,
    ])
  )
  .get(
    '/me/games/:gameId',
    compose([
      validate(gameValidator.byId),
      authenticate(),
      gameController.byId,
    ])
  )
  .put(
    '/me/games/:gameId',
    compose([
      validate(gameValidator.guess),
      authenticate(),
      gameController.guess,
    ])
  )
  .get(
    '/me/followers',
    compose([
      validate(userValidator.query),
      authenticate(),
      userController.getMyFollowers,
    ])
  )
  .get(
    '/me/following',
    compose([
      validate(userValidator.query),
      authenticate(),
      userController.getMyFollowing,
    ])
  )
  .get(
    '/:username',
    compose([
      validate(userValidator.specific),
      userController.get,
    ])
  )
  .get(
    '/:username/progression',
    compose([
      validate(userValidator.specific),
      userController.progression,
    ])
  )
  .post(
    '/:username/follow',
    compose([
      validate(userValidator.specific),
      authenticate(),
      userController.follow,
    ]),
  )
  .post(
    '/:username/unfollow',
    compose([
      validate(userValidator.specific),
      authenticate(),
      userController.unfollow,
    ]),
  )
  .get(
    '/:username/followers',
    compose([
      validate(userValidator.followQuery),
      userController.getFollowers,
    ])
  )
  .get(
    '/:username/following',
    compose([
      validate(userValidator.followQuery),
      userController.getFollowing,
    ])
  )

export default router;
