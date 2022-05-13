import { logger } from "../utils";
import { v4 as uuid } from 'uuid';
import { Context, Next } from "koa";

const logging = async (ctx: Context, next: Next) => {
  const reqid = uuid();
  try {
    await next();
    logger.info(`[${reqid}] ${ctx.ip} ${ctx.method.toUpperCase()} ${ctx.path} (${ctx.response.status}) `);
  } catch (err) {
    logger.error(`[${reqid}] (${err.status}) ${ctx.method.toUpperCase()} ${ctx.path} ${ctx.ip}: ${err.message}`);
    throw err;
  }
};

export default logging;
