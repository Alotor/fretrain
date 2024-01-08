import './style.css'
import * as st from "./state" ;
import { NoteColors } from "./constants.ts";

import Fretboard from "./ui/Fretboard";

function start() {
  st.initState();
  // st.state.currentNote = randomNote();
  // st.state.currentString = randomString();
  st.nextString();
  st.state.visible = new Set();

  const noteLabel = document.getElementById("selectedNoteLabel")!;
  noteLabel.textContent = st.state.currentNote;
  
  noteLabel.style.setProperty("--current-note-color", NoteColors[st.state.currentNote]);
  
  const container = document.querySelector(".fretboard") as HTMLElement;
  if (container){
    Fretboard(container);
  }

  Fretboard.markNextString(st.state.currentString);
}

window.onerror = function (message, _file, _line, _col, error) {
  console.log(message, "from", error?.stack);
  console.error(error);
};

start();

document.getElementById("resetBtn")!.addEventListener("click", start);
