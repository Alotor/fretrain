import * as st from "../state";
import FretButton from "./FretButton";
import StringPanel from "./StringPanel";

export default function Fretboard(container: HTMLElement) {

  function clickButton(row: number, col: number) {
    st.state.visible.add(st.coord(row, col));
    render();    
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
