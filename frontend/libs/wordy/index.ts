import { authStore } from './store';
import { GameCreateInput, GuessInput, LoginInput, Method, PaginationOptions, PhotoStageInput, RegisterInput, UpdateInput, Wordy } from './types';

const API_BASE = process.env.NEXT_PUBLIC_WORDY_API_BASE;

const request = async <T, R>(
  method: Method, 
  url: string,
  data: T,
  authenticated?: boolean,
): Promise<Wordy.Response<R>> => {

  const {
    access,
    refresh,
  } = authStore.getState();
  
  if (authenticated && (!access || !refresh)) {
    throw new Error('Not logged in.');
  }

  const refreshing = authenticated && url === '/auth/refresh';

  try {

    const response = await fetch(
      `${API_BASE}${url}`,
      {
        method,
        headers: {
          ...(authenticated ? { "Authorization": `Bearer ${refreshing ? refresh : access}` } : {}),
          "Content-Type": "application/json"
        },
        ...(
          method === "POST" || method === "PUT" ? (
            { body: JSON.stringify(data) }
          ) : {}
        )
      }
    );

    const result = await response.json();

    if (authenticated && response.status === 401) {
      if (refreshing) {
        throw new Error('Bad credentials.');
      } else {
        await request(Method.POST, '/auth/refresh', null, true);
        return await request(method, url, data, authenticated);
      }
    }

    if (result.auth) {
      authStore.setState(result.auth);
    }

    return result;
  } catch (err) {
    console.log(err);
    return { error: { code: -1, message: 'Request failed.' }};
  }
}

const GET = async <T, R>(url: string, data: T, authenticated?: boolean): Promise<Wordy.Response<R>> => request(Method.GET, url, data, authenticated);
const POST = async <T, R>(url: string, data: T, authenticated?: boolean): Promise<Wordy.Response<R>> => request(Method.POST, url, data, authenticated);
const PUT = async <T, R>(url: string, data: T, authenticated?: boolean): Promise<Wordy.Response<R>> => request(Method.PUT, url, data, authenticated);
// const PATCH = async <T, R>(url: string, data: T, authenticated?: boolean): Promise<Wordy.Response<R>> => request(Method.PATCH, url, data, authenticated);
// const DELETE = async <T, R>(url: string, data: T, authenticated?: boolean): Promise<Wordy.Response<R>> => request(Method.DELETE, url, data, authenticated);

const wordy = {
  internationalization: {
    locale: async () => GET<null, { locale: string }>('/internationalization/locale', null),
    languages: async () => GET<null, Wordy.Language[]>('/internationalization/languages', null),
  },
  auth: {
    register: async (input: RegisterInput) => POST<RegisterInput, Wordy.User>('/auth/register', input),
    login: async (input: LoginInput) => POST<LoginInput, Wordy.User>('/auth/login', input),
  },
  user: {
    me: {
      get: async () => GET<null, Wordy.User>('/user/me', null, true),
      games: async () => GET<null, Wordy.Game[]>('/user/me/games', null, true),
      game: async (id: string) => GET<null, Wordy.Game>(`/user/me/games/${id}`, null, true),
      followers: async (options?: PaginationOptions) => GET<PaginationOptions, Wordy.User[]>(`/user/me/followers`, options || {}, true),
      following: async (options?: PaginationOptions) => GET<PaginationOptions, Wordy.User[]>(`/user/me/following`, options || {}, true),
      generatePhotoUploadUrl: async (mime: string) => POST<PhotoStageInput, Wordy.PhotoStage>(`/user/me/photo`, { mime }, true),
      update: async (input: UpdateInput) => PUT<UpdateInput, Wordy.User>('/user/me', input, true),
    },
    progression: async (username: string) => GET<null, Wordy.Progression>(`/user/${username}/progression`, null),
    get: async (username: string) => GET<null, Wordy.User>(`/user/${username}`, null),
    follow: async (username: string) => POST<null, {}>(`/user/${username}/follow`, null, true),
    unfollow: async (username: string) => POST<null, {}>(`/user/${username}/unfollow`, null, true),
    followers: async (username: string, options?: PaginationOptions) => GET<PaginationOptions, Wordy.User[]>(`/user/${username}/followers`, options || {}),
    following: async (username: string, options?: PaginationOptions) => GET<PaginationOptions, Wordy.User[]>(`/user/${username}/following`, options || {}),
  },
  game: {
    create: async (difficulty: Wordy.Difficulty) => POST<GameCreateInput, Wordy.Game>('/games/new', { difficulty }, true),
    guess: async (id: string, guess: string) => POST<GuessInput, Wordy.Game>(`/games/${id}/guess`, { guess }, true),
  }
};

export default wordy;