import { prisma } from "../../integrations";
import { Difficulty, User } from "@prisma/client";
import aws from "../../services/aws";
import { deleteUpload } from "../../services/aws/file";
import ApiError from "../../utils/ApiError";
import { Language } from "../../utils/words";
import { encode } from "blurhash";
import { StatusCodes } from "http-status-codes";
import sharp from "sharp";
import { PaginationOptions, UserInput, UserUpdateInput } from "../../types";

/**
 * Creates a new user.
 * @param {UserInput} data
 */
export const create = async (data: UserInput) => {
  const user = await prisma.user.create({
    data
  });

  return user;
};

/**
 * Finds a user given its ID.
 * @param {string} id The ID of the user to fetch.
 * @returns {User | null} The User on success, null otherwise.
 */
export const byId = async (id: string, counts?: boolean) => {
  const user = await prisma.user.findFirst({
    where: { id },
    ...(
      counts ? {
        include: {
          _count: {
            select: {
              follows: true,
              followedBy: true,
            }
          }
        }
      } : {}
    )
  });

  return user;
};

/**
 * Finds a user given its email.
 * @param {string} email The email of the user to fetch.
 * @returns {User | null} The User on success, null otherwise.
 */
export const byEmail = async (email: string, counts?: boolean) => {
  const user = await prisma.user.findFirst({
    where: { email },
    ...(
      counts ? {
        include: {
          _count: {
            select: {
              follows: true,
              followedBy: true,
            }
          }
        }
      } : {}
    )
  });

  return user;
};

/**
 * Finds a user given its username.
 * @param {string} username The username of the user to fetch.
 * @returns {User | null} The User on success, null otherwise.
 */
 export const byUsername = async (username: string, counts?: boolean) => {
  const user = await prisma.user.findFirst({
    where: { username },
    ...(
      counts ? {
        include: {
          _count: {
            select: {
              follows: true,
              followedBy: true,
            }
          }
        }
      } : {}
    )
  });

  return user;
};

/**
 * Deletes a user given its Id.
 * @param {string} id The ID of the user to delete. 
 */
export const remove = async (id: string) => {
  await prisma.user.delete({
    where: { id }
  });
};

export const progression = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      games: {
        where: {
          complete: true,
        },
        select: {
          difficulty: true,
          language: true,
          correct: true,
        }
      }
    }
  });

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");

  return user.games.reduce(
    (acc: Record<Language, Record<Difficulty, { correct: number, incorrect: number }>>, { language, difficulty, correct }) => {

      if (!acc[language]) {
        acc[language] = {
          [Difficulty.EASY]: { correct: 0, incorrect: 0 },
          [Difficulty.MEDIUM]: { correct: 0, incorrect: 0 },
          [Difficulty.HARD]: { correct: 0, incorrect: 0 },
          [Difficulty.INSANE]: { correct: 0, incorrect: 0 },
        }
      }

      acc[language][difficulty][correct ? 'correct' : 'incorrect'] += 1;

      return acc;
    },
    {}
  );
}

export const follow = async (
  user: User,
  username: string,
) => {
  
  // Prevent a user from following itself
  if (user.username === username) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "User cannot follow itself."
    );
  }

  const following = await byUsername(username);

  // User exists
  if (!following) {
    throw new ApiError(
      StatusCodes.NOT_FOUND, 
      `User with username "${username}" not found.`
    );
  }

  const follow = await prisma.follows.create({
    data: {
      follower: { connect: { id: user.id }},
      following: { connect: { id: following.id }},
    }
  });

  return follow;
}

export const unfollow = async (
  user: User,
  username: string,
) => {
  
  // Prevent a user from unfollowing itself
  if (user.username === username) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "User cannot unfollow itself (or follow itself.)"
    );
  }

  const following = await byUsername(username);

  if (!following) {
    throw new ApiError(
      StatusCodes.NOT_FOUND, 
      `User with username "${username}" not found.`
    );
  }

  const follow = await prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: following.id,
      }
    }
  });

  if (!follow) {
    throw new ApiError(
      StatusCodes.NOT_FOUND, 
      `User is not following a user with username ${username}.`
    );
  }

  return follow;
}

export const followers = async (
  username: string,
  options: PaginationOptions,
) => {
  const {
    cursor,
    limit,
  } = options;

  const users = await prisma.user.findMany({
    where: {
      follows: {
        some: {
          following: { username }
        }
      }
    },
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
  });

  return users;
}

export const following = async (
  username: string,
  options: PaginationOptions,
) => {
  const {
    cursor,
    limit,
  } = options;

  const users = await prisma.user.findMany({
    where: {
      followedBy: {
        some: {
          follower: { username }
        }
      }
    },
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
  });

  return users;
}

export const update = async (
  user: User,
  input: UserUpdateInput
) => {

  let { photoBlurHash } = user;

  if (input.photoUrl) {
    try {
      const image = await aws.file.verifyUpload(input.photoUrl);

      if (!image) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Photo not yet updated.`,
        )
      }

      const width = 512;
      const height = 512;

      const pixels = await sharp(image)
        .raw()
        .ensureAlpha()
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

      photoBlurHash = encode(new Uint8ClampedArray(pixels), width, height, 4, 4);

      if (user.photoUrl) await deleteUpload(user.photoUrl);
    } catch (err) {
      console.log(err);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR, 
        `Something went wrong on our end.`
      );
    }
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      ...input,
      photoBlurHash,
    },
  });
}