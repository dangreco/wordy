/* eslint-disable react-hooks/exhaustive-deps */

import { generateShare } from "@components/game/utils";
import wordy from "@wordy";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "./store";
import { PaginationOptions, Wordy } from "./types";

export const useUser = (username?: string) => {
  const { user: me } = useUserStore();
  const [user, setUser] = useState<Wordy.User | undefined>();

  const refresh = () => {};
  const logout = () => {};

  const loadUser = async () => {
    if (!username) return;

    const { error, data } = await wordy.user.get(username);
    setUser(data || user);
  }

  useEffect(() => {
    loadUser();
  }, [username]);

  return {
    user: username ? user : me,
    refresh,
    logout,
  };
};

export const useGame = (id: string | undefined) => {
  const [game, setGame] = useState<Wordy.Game | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Wordy.Error | undefined>();

  const loadGame = async () => {
    if (!id) return;

    setLoading(true);

    const { data, error } = await wordy.user.me.game(id);

    setGame(data || game);
    setError(error);

    setLoading(false);
  };

  const guess = async (word: string) => {
    if (!game || game.complete || word.length !== game.size) {
      return false;
    }

    const { data, error } = await wordy.game.guess(game.id, word);

    setGame(data || game);
    setError(error);

    return (error === undefined && data !== undefined);
  };

  const share = () => {
    if (!game) return;

    const data = generateShare(game);
    if (navigator && navigator.share) {
      navigator.share({ text: data }) 
    }
  };

  useEffect(() => {
    loadGame();
  }, [id]);

  return { game, guess, share, loading, error };
};

export const useProgression = (id: string | undefined) => {
  const [progression, setProgression] = useState<Wordy.Progression | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Wordy.Error | undefined>();

  const loadProgress = async () => {
    if (!id) return;

    setLoading(true);

    const { data, error } = await wordy.user.progression(id);

    setProgression(data || progression);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    loadProgress();
  }, [id]);

  return { progression, loading, error }
}

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Wordy.Language[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Wordy.Error | undefined>();

  const loadLanguages = async () => {
    setLoading(true);

    const { data, error } = await wordy.internationalization.languages();

    setLanguages(data || languages);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  return { 
    languages: languages ? Object.fromEntries(
      languages.map((language) => [language.language, language])
    ) : undefined, 
    loading, 
    error 
  }
}

type Fetcher<T> = () => Promise<T[]>;

const usePaginated = <T extends { id: string }>(
  fetcher: Fetcher<T>,
) => {
  const [data, setData] = useState<Record<string, T>>({});
  const [loading, setLoading] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const loadMore = async () => {
    setLoading(true);

    const raw = await fetcher();

    if (!raw.length) {
      setAllDone(true);
    }

    setData((data) => ({
      ...data,
      ...(Object.fromEntries(
        raw.map((item) => [item.id, item])
      ))
    }));

    setLoading(false);
  };

  useEffect(() => {
    setData({});
    setAllDone(false)
    loadMore();
  }, [fetcher])

  return {
    data: Object.values(data),
    loading,
    allDone,
    loadMore,
  };
}

export const useFollowers = (username: string | undefined) => {
  const fetcher = useCallback(
    async () => {
      if (!username) return [];

      const {
        data,
      } = await wordy.user.followers(username);

      return data || [];
    },
    [username]
  );

  const {
    data,
    loading,
    allDone,
    loadMore,
  } = usePaginated(fetcher); 

  return {
    followers: data,
    loading,
    allDone,
    loadMore,
  }
}

export const useFollowing = (username: string | undefined) => {
  const fetcher = useCallback(
    async () => {
      if (!username) return [];

      const {
        data,
      } = await wordy.user.following(username);

      return data || [];
    },
    [username]
  );

  const {
    data,
    loading,
    allDone,
    loadMore,
  } = usePaginated(fetcher); 

  return {
    following: data,
    loading,
    allDone,
    loadMore,
  }
}