import './style.css'
import * as st from "./state" ;

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
  document.getElementById("selectedNoteLabel")!.textContent = st.state.currentNote;
  console.log(st.state);

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
