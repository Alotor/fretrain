import type { StringState } from "@/store";

export function randomNote(accidentals: boolean = false) {
  const notes =
    accidentals ?
    ["A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"] :
    ["A", "B", "C", "D", "E", "F", "G"];

  return notes[Math.floor(notes.length * Math.random())];
}

export function nextRandomString(state: Record<number, StringState>): number | null {
  let pending = [] as Array<number>;

  for (let i = 1; i <= 6; i++) {
    if (state[i] === 'pending') {
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
  randomNote,
  nextRandomString,
};
