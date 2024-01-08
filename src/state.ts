interface State {
  visible: Set<string>;
  currentNote: string;
  currentString: number;
  pending: Set<number>;
}

export let state: State;

export function initState () {
  state = {
    visible: new Set<string>(),
    currentNote: randomNote(false),
    currentString: 1,
    pending: new Set([1,2,3,4,5,6])
  };
}


export function coord(row: number, col: number): string {
  const stringNum = (6 - col + 1);
  const fretNum = row - 1;
  return `${stringNum},${fretNum}`;
}


export function randomNote(accidentals: boolean = false) {
  const notes =
    accidentals ?
    ["A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"] :
    ["A", "B", "C", "D", "E", "F", "G"];

  return notes[Math.floor(notes.length * Math.random())];
}

export function nextString() {
  if (state.pending.size > 0) {
    const pendingArr = [...state.pending];
    const ridx = Math.floor(Math.random() * pendingArr.length);
    const nextString = pendingArr[ridx];
    state.pending.delete(nextString);
    state.currentString = nextString;
  }
}
