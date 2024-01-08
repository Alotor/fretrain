import * as st from "../state";
import FretButton from "./FretButton";
import StringPanel from "./StringPanel";
import {StringNotes} from "../constants";

export default function Fretboard(container: HTMLElement) {

  function clickButton(row: number, col: number) {
    const coord = st.coord(row, col);
    st.state.visible.add(coord);
    const button = document.querySelector(`button[data-coord='${coord}']`)! as HTMLButtonElement;

    const clickedNote = button.dataset["note"];
    if (!clickedNote?.endsWith("#") && !clickedNote?.endsWith("b")) {
      button.classList.remove("hidden");
    }

    const stringNum = (6 - col + 1);
    const fretNum = row - 1;
    const notes = new Set(StringNotes[stringNum][fretNum]);

    if(st.state.currentString === stringNum && notes.has(st.state.currentNote)) {
      Fretboard.markOk(st.state.currentString);
    } else {
      Fretboard.markFail(st.state.currentString);
    }

    if (st.state.pending.size > 0) {
      st.nextString();
      Fretboard.markNextString(st.state.currentString);
    }
  }
  
  function render() {
    container.innerHTML = "";

    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 8; col++) {
        if (col === 0 || col === 7 || row === 0) {
          container.appendChild(StringPanel(row, col));
        } else {
          container.appendChild(FretButton(row, col, clickButton.bind(null, row, col)));
        }
      }
    }
  }

  render();

  const width = document.querySelector(".fretboard-btn")?.clientWidth;
  if (width) {
    container.style.setProperty("--element-width", `${width-8}px`);
  }
}

Fretboard.markNextString = (stringNum: number) => {
  document.querySelector(`.string[data-string='${stringNum}']`)!.className = "string next";
};

Fretboard.markOk = (stringNum: number) => {
  document.querySelector(`.string[data-string='${stringNum}']`)!.className = "string ok";
};

Fretboard.markFail = (stringNum: number) => {
  document.querySelector(`.string[data-string='${stringNum}']`)!.className = "string fail";
};

Fretboard.resetString = (stringNum: number) => {
  document.querySelector(`.string[data-string='${stringNum}']`)!.className = "string";
};
