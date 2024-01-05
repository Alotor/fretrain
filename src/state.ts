
const initState = () =>({
  visible: new Set<string>(),
  currentNote: "C"
});

export const state = initState();

export function coord(row: number, col: number): string {
  const stringNum = (6 - col + 1);
  const fretNum = row - 1;
  return `${stringNum},${fretNum}`;
}
