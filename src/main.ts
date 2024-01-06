import './style.css'
import * as st from "./state" ;
import { NoteColors } from "./constants.ts";

import Fretboard from "./ui/Fretboard";

function randomNote(accidentals: boolean = false) {
  const notes =
    accidentals ?
    ["A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"] :
    ["A", "B", "C", "D", "E", "F", "G"];

  return notes[Math.floor(notes.length * Math.random())];
}

function start() {
  st.state.currentNote = randomNote();
  st.state.visible = new Set();

  const noteLabel = document.getElementById("selectedNoteLabel")!;
  noteLabel.textContent = st.state.currentNote;
  
  noteLabel.style.setProperty("--current-note-color", NoteColors[st.state.currentNote]);
  
  const container = document.querySelector(".fretboard") as HTMLElement;
  if (container){
    Fretboard(container);
  }
}

window.onerror = function (message, _file, _line, _col, error) {
  console.log(message, "from", error?.stack);
  console.error(error);
};

start();

document.getElementById("resetBtn")!.addEventListener("click", start);
