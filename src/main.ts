import './style.css'

const colors = {
  "A": "#e88d49",
  "B": "#918f8f",
  "C": "#9abc56",
  "D": "#7558a1",
  "E": "#5b7dc0",
  "F": "#e05659",
  "G": "#2d467b",

  "A#": "#e88d49",
  "C#": "#9abc56",
  "D#": "#7558a1",
  "F#": "#e05659",
  "G#": "#2d467b",

  "Ab": "#e88d49",
  "Bb": "#918f8f",
  "Db": "#7558a1",
  "Eb": "#5b7dc0",
  "Gb": "#2d467b",
}

const notes = {
  6: {
    0:  ["E"],
    1:  ["F"],
    2:  ["F#", "Gb"],
    3:  ["G"],
    4:  ["G#", "Ab"],
    5:  ["A"],
    6:  ["A#", "Bb"],
    7:  ["B"],
    8:  ["C"],
    9:  ["C#", "Db"],
    10: ["D"],
    11: ["D#", "Eb"],
    12: ["E"],
  },

  5: {
    0:  ["A"],
    1:  ["A#", "Bb"],
    2:  ["B"],
    3:  ["C"],
    4:  ["C#", "Db"],
    5:  ["D"],
    6:  ["D#", "Eb"],
    7:  ["E"],
    8:  ["F"],
    9:  ["F#", "Gb"],
    10: ["G"],
    11: ["G#", "Ab"],
    12: ["A"],
  },
  
  4: {
    0:  ["D"],
    1:  ["D#", "Eb"],
    2:  ["E"],
    3:  ["F"],
    4:  ["F#", "Gb"],
    5:  ["G"],
    6:  ["G#", "Ab"],
    7:  ["A"],
    8:  ["A#", "Bb"],
    9:  ["B"],
    10: ["C"],
    11: ["C#", "Db"],
    12: ["D"],
  },

  3: {
    0:  ["G"],
    1:  ["G#", "Ab"],
    2:  ["A"],
    3:  ["A#", "Bb"],
    4:  ["B"],
    5:  ["C"],
    6:  ["C#", "Db"],
    7:  ["D"],
    8:  ["D#", "Eb"],
    9: ["E"],
    10: ["F"],
    11: ["F#", "Gb"],
    12: ["G"],
  },

  2: {
    0:  ["B"],
    1:  ["C"],
    2:  ["C#", "Db"],
    3: ["D"],
    4: ["D#", "Eb"],
    5: ["E"],
    6:  ["F"],
    7:  ["F#", "Gb"],
    8:  ["G"],
    9:  ["G#", "Ab"],
    10:  ["A"],
    11:  ["A#", "Bb"],
    12:  ["B"],
  },

  1: {
    0:  ["E"],
    1:  ["F"],
    2:  ["F#", "Gb"],
    3:  ["G"],
    4:  ["G#", "Ab"],
    5:  ["A"],
    6:  ["A#", "Bb"],
    7:  ["B"],
    8:  ["C"],
    9:  ["C#", "Db"],
    10: ["D"],
    11: ["D#", "Eb"],
    12: ["E"],
  },
};

let visible = new Set();
let selected;

function createButton(row: number, column: number): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "fretboard-btn";

  const stringNum = (6 - column + 1);
  const fretNum = row - 1;
  const note = notes[stringNum][fretNum][0];
  const coord = `${stringNum},${fretNum}`;
  
  button.textContent = note;
  if (note.endsWith("#") || note.endsWith("b") || !visible.has(coord)) {
    button.classList.add("hidden");
  }
  
  button.style.setProperty("--color", colors[note]);
  button.addEventListener("click", (e) => {
    // alert(`${row}, ${column}`);
    visible.add(coord);
    render();
  });
  return button;
}

function start() {
  const notes = ["A", "B", "C", "D", "E", "F"];
  const i = Math.floor(Math.random() * notes.length);
  selected = notes[i];
  visible = new Set();
  document.getElementById("selectedNoteLabel").textContent = selected;
  render();
}

function render() {
  const fr = document.querySelector(".fretboard");

  if (fr) {
    fr.innerHTML = "";

    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 8; col++) {
        if (col === 0 || col === 7 || row === 0) {
          const el = document.createElement("div")
          el.className = "cont";

          if (row === 0 && col > 0 && col < 7) {
            el.className = "string";

            const check = document.createElement("i");
            check.className = "check";
            //check.classList.add("ok");
            //check.classList.add("fail");
            el.appendChild(check);
          }

          if (row === 4 || row === 6 || row === 8 || row === 10 || row === 13) {
            const mark = document.createElement("div")
            mark.className = "mark";
            el.appendChild(mark);
          }

          if (row > 1) {
            const fret = document.createElement("div");
            fret.className = (row === 2) ? "fret nut" : "fret";
            el.appendChild(fret);
          }
          
          fr.appendChild(el);
        } else {
          fr.appendChild(createButton(row, col));
        }
      }
    }

    const width = document.querySelector(".fretboard-btn").clientWidth;
    fr.style.setProperty("--element-width", `${width-8}px`);
  }
}

start();

document.getElementById("resetBtn").addEventListener("click", start);
