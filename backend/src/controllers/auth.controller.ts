import { wordy } from "../services";
import { respond, serialize } from "../utils";
import { Context } from "koa";
import { LoginInput, RegisterInput } from "../types";

export const register = async (ctx: Context) => {
  const input: RegisterInput = ctx.validated.body;
  const { user, auth } = await wordy.auth.register(input);
  respond(
    ctx, 
    serialize(user, true), 
    auth
  );
};

export const login = async (ctx: Context) => {
  const input: LoginInput = ctx.validated.body;
  const { user, auth } = await wordy.auth.login(input);

  respond(
    ctx, 
    serialize(user, true), 
    auth
  );
};

export const refresh = async (ctx: Context) => {
  const auth = await wordy.auth.refresh(ctx.user);

  respond(
    ctx, 
    null, 
    auth
  );
}