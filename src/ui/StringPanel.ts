
export default function StringPanel(row: number, col: number) {
  const el = document.createElement("div")
  el.className = "cont";

  if (row === 0 && col > 0 && col < 7) {
    el.className = "string";

    const check = document.createElement("i");
    check.dataset['string'] = `${col}`;
    check.className = "check";
    //check.classList.add("ok");
    //check.classList.add("fail");
    // check.classList.add("next");
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

  return el;
}

export function markOK() {
  
}

export function markFail() {
  
}

export function markNext() {
  
}

