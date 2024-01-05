import * as st from "../state" ;
import { NoteColors, StringNotes } from "../constants.ts";

export default function FretButton(row: number, column: number, onClick: (e: Event) => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "fretboard-btn";

  const stringNum = (6 - column + 1);
  const fretNum = row - 1;
  const note = StringNotes[stringNum][fretNum][0];

  button.textContent = note;
  if (note.endsWith("#") || note.endsWith("b") || !st.state.visible.has(st.coord(row, column))) {
    button.classList.add("hidden");
  }
  
  button.style.setProperty("--color", NoteColors[note]);
  button.addEventListener("click", onClick);
  return button;
}
