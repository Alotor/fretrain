import type { StringState } from "@/store";
import { Options } from "@/OptionsStorage";

export function selectNote(options: Options) {
  //const notes =
  //  accidentals ?
  //  ["A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"] :
  //  ["A", "B", "C", "D", "E", "F", "G"];
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


export default {
  selectNote,
  selectString,
};
