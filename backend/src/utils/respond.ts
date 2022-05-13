import { Context } from "koa";

const respond = (
  ctx: Context,
  data?: any,
  auth?: any,
  error?: any, 
) => {
  ctx.body = {
    data,
    auth,
    error,
  }
};

export default respond;