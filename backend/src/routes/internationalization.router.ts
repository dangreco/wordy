import compose from "koa-compose";
import { internationalization as controller } from "../controllers";
import Router from "@koa/router";

const router = new Router();

router
  .get(
    '/locale', 
    compose([
      controller.locale,
    ])
  )
  .get(
    '/languages',
    compose([
      controller.languages,
    ])
  )

export default router;
