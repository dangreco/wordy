import respond from "../utils/respond";
import { getLanguageStats } from "../utils/words";
import { Context } from "koa";

export const locale = async (ctx: Context) => respond(
  ctx, 
  { locale: ctx.locale }, 
);

export const languages = async (ctx: Context) => respond(
  ctx,
  getLanguageStats(),
)