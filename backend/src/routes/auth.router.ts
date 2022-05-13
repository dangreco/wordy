import { authenticate, validate } from "../middleware";
import { auth as validator } from '../validations';
import { auth as controller } from '../controllers';
import compose from "koa-compose";
import Router from "@koa/router";
import { TokenType } from "@prisma/client";

const router = new Router();

router
  .post(
    '/register', 
    compose([
      validate(validator.register),
      controller.register,
    ])
  )
  .post(
    '/login', 
    compose([
      validate(validator.login),
      controller.login,
    ])
  )
  .post(
    '/refresh',
    compose([
      authenticate(TokenType.REFRESH),
      controller.refresh,
    ])
  );

export default router;
