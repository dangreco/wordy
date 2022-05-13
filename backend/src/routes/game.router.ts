import compose from "koa-compose";
import { game as controller } from '../controllers';
import { game as validator } from '../validations';
import Router from "@koa/router";
import authenticate from "../middleware/authenticate";
import validate from "../middleware/validate";

const router = new Router();

router
  .post("/new", compose([authenticate(), validate(validator.create), controller.create]))
  .post("/:gameId/guess", compose([authenticate(), validate(validator.guess), controller.guess]))

export default router;
