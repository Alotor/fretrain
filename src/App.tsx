import { useRef, useEffect, useCallback} from 'react';

import { useAppFsm } from "@/App.fsm";
import css from '@/App.module.css';
import { useStore } from "@/store";

import FretMarker from "@/components/FretMarker";
import NoteButton from "@/components/NoteButton";
import StringInfo from "@/components/StringInfo";
import Header from "@/components/Header";


function App() {
  const [ store, dispatch ] = useStore();
  const [ _state, send ] = useAppFsm(store, dispatch);

  // console.log(_state.value, store);

  const mainRef = useRef<HTMLDivElement>(null);
  const rows = new Array(15).fill(undefined).map((_, i) => i);
  const cols = new Array(8).fill(undefined).map((_, i) => i);

  const {
    selectedNote,
    selectedString,
    selectedStringProgress,
    stringsState,
    displayNotes,
  } = store;

  useEffect(() => {
    const buttonElem = document.querySelector("[data-note]");
    if (mainRef.current && buttonElem) {
      const height = buttonElem.clientHeight;
      const width = Math.min(height, buttonElem.clientWidth);
      mainRef.current.style.setProperty("--element-width", `${width - 8}px`);
    }
  }, []);

  const handleClickNote = useCallback((stringNum: number, note: string) => {
    if (stringNum === selectedString) {
      if (selectedNote === note) {
        send({ "type": "select.ok" });
      } else {
        send({ "type": "select.fail" });
      }
    }
  }, [selectedString, selectedNote]);

  const handleRefresh = useCallback(() => {
    send({ type: "session.repeat" });
  }, []);

  const handleNext = useCallback(() => {
    send({ type: "session.next" });
  }, []);

  const fretElements = rows.map((_, row) => cols.map((_, col) => {
    const stringNum = (6 - col + 1);

    if (row === 0 && col > 0 && col < 7) {
      return <StringInfo
               key={`string-${stringNum}`}
               state={stringsState[stringNum]}
               progress={(stringNum === selectedString) ? selectedStringProgress : null } />
    } else if (col === 0 || col === 7 || row === 0 || row === 14) {
      return <FretMarker key={`marker-${row}-${col}`} row={row} col={col} />
    } else if (row === 1 && row <= 14) {
      return <div key={`empty-${row}-${col}`}></div>;
    } else {
      const fretNum = row - 1;
      return <NoteButton key={`fret-${stringNum}-${fretNum}`}
                         stringNum={stringNum}
                         fretNum={fretNum}
                         display={displayNotes.has(`${stringNum},${fretNum}`)}
                         onClick={handleClickNote} />
    }
  }));

  return (
    <div ref={mainRef} className={css.main}>
      <Header selectedNote={selectedNote}
              onRefresh={handleRefresh}
              onNext={handleNext} />
      <div className={css.fretboard}>
        {fretElements}
      </div>
    </div>
  )
}

export default App;
