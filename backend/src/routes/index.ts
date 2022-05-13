import Router from "@koa/router";

import auth from "./auth.router";
import user from './user.router';
import internationalization from './internationalization.router';
import game from './game.router';

const router = new Router();

router
  .prefix("/api/v1")
    .use("/auth", ...[auth.routes(), auth.allowedMethods(), auth.middleware()])
    .use("/user", ...[user.routes(), user.allowedMethods(), auth.middleware()])
    .use("/internationalization", ...[internationalization.routes(), internationalization.allowedMethods(), internationalization.middleware()])
    .use("/games", ...[game.routes(), game.allowedMethods(), game.middleware()])

export default router;
