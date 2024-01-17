import { useSyncExternalStore } from 'react';

const STORAGE_KEY = "fretrain/options";

export type Options = {
  appMode: "fix-note" | "fix-string" | "guess-note";
  speed: number;
  accidentals: "on" | "off";
  deterministicNoteMode: "off" | "seconds" | "thirds" | "fourths" | "fifths";
  deterministicStringMode: "off" | "down-up" | "up-down";
  endSessionBehavior: "stop" | "repeat" | "next";
  useStrings: Array<number>;
  useNotes: Array<string>;
}

const initialOptions: Options = {
  appMode: "fix-note",
  speed: 5, // seconds per note
  accidentals: "off",
  endSessionBehavior: "repeat",
  deterministicNoteMode: "off",
  deterministicStringMode: "off",
  useStrings: [1, 2, 3, 4, 5, 6],
  useNotes: ["A", "B", "C", "D", "E", "F", "G"],
};

export function useOptionsStorage() {
  const cache = {} as Record<string, Options>;
  const getSnapshot = () => {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!!value && cache.hasOwnProperty(value)) {
      return cache[value];
    }
    
    if (!value) {
      return initialOptions;
    }

    cache[value] = Object.assign({}, initialOptions, JSON.parse(value)) as Options;
    return cache[value];
  };

  const setStore = (updateOptions: (old: Options) => Options) => {
    const old = getSnapshot();
    const value = JSON.stringify(updateOptions(old));
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: value }));
  };

  const subscribe = (callback: () => void) => {
    const listener = () => {
      callback();
    };
    window.addEventListener("storage", listener);
    return () => void window.removeEventListener("storage", listener);
  };

  const store = useSyncExternalStore(subscribe, getSnapshot);

  return [store, setStore] as const;
}

