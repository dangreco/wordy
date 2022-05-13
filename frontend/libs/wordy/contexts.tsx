import React, { createContext, useEffect, useState } from "react";
import wordy from ".";
import { authStore, useUserStore } from "./store";
import { Wordy } from "./types";

interface AuthContextValues {
  authed: boolean;
  user?: Wordy.User;
}

export const AuthContext = createContext<AuthContextValues>({ authed: false });

export const AuthWrapper: React.FunctionComponent = ({ children }) => {
  const [authed, setAuthed] = useState(false);
  const { setUser } = useUserStore();

  const attemptAuth = async (auth?: Partial<Wordy.Auth>) => {
    if (!auth || !auth.access) {
      setUser(undefined);
      setAuthed(false);
      return;
    }
    
    if (!authed) {
      try {
        const { data, error } = await wordy.user.me.get();

        console.log(data);

        if (data && !error) {
          setAuthed(true);
          setUser(data);
        } else {
          setAuthed(false);
          setUser(undefined);
        }
        
      } catch {
        setAuthed(false);
        setUser(undefined);
      }
    }
  }

  useEffect(() => {
    attemptAuth(authStore.getState());
    authStore.subscribe(attemptAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ authed }}>{children}</AuthContext.Provider>
  );
};

export const LocaleContext = createContext<string>('en');

export const LocaleWrapper: React.FunctionComponent = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const loadLocale = async () => {
    const {
      data,
      error,
    } = await wordy.internationalization.locale();

    if (!error && data && data.locale) {
      setLocale(data.locale.substring(0,2));
    }
  };  

  useEffect(() => {
    loadLocale();
  }, []);

  return (
    <LocaleContext.Provider value={locale}>
      { children }
    </LocaleContext.Provider>
  )
}
