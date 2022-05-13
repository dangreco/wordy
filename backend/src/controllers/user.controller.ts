import { wordy } from "../services";
import aws from "../services/aws";
import { ApiError, respond, serialize } from "../utils";
import { Context } from "koa";

export const me = async (ctx: Context) => {
  const { id } = ctx.user;

  const user = await wordy.user.byId(id, true);

  respond(
    ctx,
    serialize(user, true),
  );
}

export const progression = async (ctx: Context) => {
  const { username } = ctx.validated.params;
  const progression = await wordy.user.progression(username);
  respond(ctx, progression);
}

export const get = async (ctx: Context) => {
  const { username } = ctx.validated.params;

  const user = await wordy.user.byUsername(username, true);

  respond(
    ctx,
    serialize(user),
  );
}

export const follow = async (ctx: Context) => {
  const { username } = ctx.validated.params;
  await wordy.user.follow(ctx.user, username);
  respond(ctx, {});
}

export const unfollow = async (ctx: Context) => {
  const { username } = ctx.validated.params;
  await wordy.user.unfollow(ctx.user, username);
  respond(ctx, {});
}

export const getFollowers = async (ctx: Context) => {
  const { username } = ctx.validated.params;
  const options = ctx.validated.query;

  const users = await wordy.user.followers(username, options);
  
  respond(ctx, users.map((user) => serialize(user)));
};

export const getFollowing = async (ctx: Context) => {  
  const { username } = ctx.validated.params;
  const options = ctx.validated.query;

  const users = await wordy.user.following(username, options);
  
  respond(ctx, users.map((user) => serialize(user)));
};

export const getMyFollowers = async (ctx: Context) => {
  const { username } = ctx.user;
  const options = ctx.validated.query;

  const users = await wordy.user.followers(username, options);

  respond(ctx, users.map((user) => serialize(user)));
};


export const getMyFollowing = async (ctx: Context) => {
  const { username } = ctx.user;
  const options = ctx.validated.query;

  const users = await wordy.user.following(username, options);

  respond(ctx, users.map((user) => serialize(user)));
};

export const update = async (ctx: Context) => {
  const input = ctx.validated.body;

  const user = await wordy.user.update(ctx.user, input);

  respond(ctx, serialize(user, true));
}

export const generatePhotoUploadUrl = async (ctx: Context) => {
  const { mime } = ctx.validated.body;
  const data = await aws.file.createTarget(mime);

  if (!data) throw new ApiError(500, "Something went wrong on our end.");

  respond(ctx, data);
}