import { Difficulty } from '@prisma/client';
import * as Locale from 'locale-codes';
import { sum } from 'lodash';
import { getWordsList } from 'most-common-words-by-language';

const DIFFICULTIES: Record<Difficulty, [min: number, max: number]> = {
  [Difficulty.EASY]: [3,5],
  [Difficulty.MEDIUM]: [6, 8],
  [Difficulty.HARD]: [9, 10],
  [Difficulty.INSANE]: [11, 25],
}

export type Language = string;

export const LANGUAGES: Language[] = Array.from(new Set(Locale.all.map(({ name }) => name))).filter(
  (lang) => {
    try {
      getWordsList(lang.toLowerCase());
      return true;
    } catch (e) {
      return false;
    }
  }
);

const WORDS: Record<Language, Record<Difficulty, string[]>> = Object.fromEntries(
  Array.from(LANGUAGES).map(
    (language) => {

      const words = getWordsList(language.toLowerCase());

      return [
        language,
        Object.fromEntries(
          Object.values(Difficulty).map(
            (difficulty) => {
              const [min, max] = DIFFICULTIES[difficulty];
              return [
                difficulty, 
                words.filter((word) => word.length >= min && word.length <= max),
              ]
            }
          )
        ) as Record<Difficulty, string[]>
      ]
    }
  )
);

const LANGUAGE_STATS = LANGUAGES.map(
  (language) => {
    const counts = Object.fromEntries(
      Object.values(Difficulty).map(
        (difficulty) => [
          difficulty,
          WORDS[language][difficulty].length,
        ]
      )
    ); 

    const total = sum(Object.values(counts));

    return {
      language,
      counts,
      total,
    }
  }
);

export const getLanguageStats = () => LANGUAGE_STATS;

export const getNumWords = (
  language: string,
  difficulty: Difficulty,
) => WORDS[language][difficulty].length;

export const getWordList = (
  language: string,
  difficulty: Difficulty,
) => WORDS[language][difficulty];

export const isValidWord = (
  language: string,
  difficulty: Difficulty,
  word: string,
) => WORDS[language][difficulty].includes(word.toLowerCase())