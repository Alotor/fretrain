import type { StringState } from "@/store";
import { Options } from "@/OptionsStorage";

const seconds =
  ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"];

const thirds =
  ["A", "C", "D#", "F#", "A#", "C#", "E", "G", "B", "D", "F", "G#", "A"];

const fourths =
  ["A", "D", "G", "C", "F", "A#", "D#", "G#", "C#", "F#", "B", "E", "A"];

const fifths =
  ["A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D", "A"];

export function selectNote(options: Options, selectedNote: string) {
  const notes = options.useNotes;

  let noteList: Array<string> | null = null;
  if (options.deterministicNoteMode === "off") {
    return notes[Math.floor(notes.length * Math.random())];
  } else if (options.deterministicNoteMode === "seconds") {
    noteList = seconds;
  } else if (options.deterministicNoteMode === "thirds") {
    noteList = thirds;
  } else if (options.deterministicNoteMode === "fourths") {
    noteList = fourths;
  } else if (options.deterministicNoteMode === "fifths") {
    noteList = fifths;
  } else {
    noteList = [...options.useNotes];
  }

  const useNotes = new Set(options.useNotes);
  const currentNotes = noteList.filter((s) => useNotes.has(s));
  const idx =  currentNotes.findIndex((s) => s === selectedNote);
  return  currentNotes[idx + 1];
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

  if (options.deterministicStringMode === "off") {
    const ridx = Math.floor(Math.random() * pending.length);
    return pending[ridx];
  } else if (options.deterministicStringMode === "down-up"){
    return Math.min(...pending);
  } else {
    return Math.max(...pending);
  }
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
