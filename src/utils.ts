import type { StringState } from "@/store";
import { Options } from "@/OptionsStorage";

export function selectNote(options: Options) {
  const notes = options.useNotes;
  return notes[Math.floor(notes.length * Math.random())];
}

export function selectString(options: Options, state: Record<number, StringState>): number | null {
  const useStrings = new Set(options.useStrings);
  let pending = [] as Array<number>;

  for (let i = 1; i <= 6; i++) {
    if (state[i] === 'pending' && useStrings.has(i)) {
      pending.push(i);
    }
  }

  if (pending.length === 0) {
    return null;
  }

  const ridx = Math.floor(Math.random() * pending.length);
  return pending[ridx];
}

export function isStringsLeft(options: Options, state: Record<number, StringState>): boolean {
  const useStrings = new Set(options.useStrings);

  for (let i = 1; i <= 6; i++) {
    if (state[i] === 'pending' && useStrings.has(i)) {
      return true;
    }
  }

  return false;
}

export default {
  selectNote,
  selectString,
  isStringsLeft,
};
