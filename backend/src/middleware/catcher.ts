import ApiError from "../utils/ApiError";
import respond from "../utils/respond";
import { Context, Next } from "koa";

const catcher = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ApiError) {
      ctx.status = err.status;
      respond(
        ctx, 
        null,
        null,
        {
          code: err.status,
          message: err.message,
        } 
      );
    } else {
      ctx.status = 500;
      respond(
        ctx, 
        null,
        null,
        {
          code: 500,
          message: 'Something went wrong on our end.',
        }  
      );
    }
  }
}

export default catcher;