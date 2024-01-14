import { useRef, useEffect, useCallback} from 'react';
import { TotalTime } from "./constants.ts";
import { useMachine } from '@xstate/react';
import { enableMapSet } from "immer";

import css from '@/App.module.css';
import random from "@/random";
import AppFsm, { AppFsmEvents } from "@/App.fsm";
import FretMarker from "@/components/FretMarker";
import NoteButton from "@/components/NoteButton";
import StringInfo from "@/components/StringInfo";
import Header from "@/components/Header";

import { Store, StoreAction, useStore } from "@/store";

enableMapSet();

function useAppFsm (store: Store, dispatch: (action: StoreAction) => void): [ state: unknown, send: (event: AppFsmEvents) => void ] {
  const timerRef = useRef<number | null>(null);
  const timeSinceStartRef = useRef<number | null>(null);

  const [ state, send ] = useMachine(AppFsm.provide({
    actions: {
      selectNote: () => {
        const note = random.randomNote();
        dispatch({ type: "select-note", note });
        send({ type: "note.selected" });
      },

      selectString: () => {
        const selString = random.nextRandomString(store.stringsState);
        if (selString) {
          dispatch({ type: "select-string", string: selString });
          send({ type: "string.selected" });
        }
      },

      stringStart: () => {
        send({type: "string.start"});
      },

      startTimer: () => {
        timeSinceStartRef.current = new Date().getTime();
        const id = setInterval(() => {
          const startTime = timeSinceStartRef.current;
          if (startTime) {
            const ellapsed = (new Date().getTime() - startTime) / 1000;
            send({type: "time", ellapsed});
          }
        }, 16.6);
        timerRef.current = id;
      },

      stopTimer: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },

      updateProgress: ({ event }) => {
        if (event.type === "time") {
          const progress = (event.ellapsed / TotalTime) * 100;
          dispatch({ type: "update-string-progress", progress });
          if (event.ellapsed >= TotalTime) {
            send({ type: "select.timeout" })
          }
        }
      },
      displayStart: () => {
        send({ type: "start" });
      },

      displayOk: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "ok" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },

      displayFail: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "fail" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },

      clearState: () => {
        dispatch({ type: "reset" });
      },
      clearStringsState: () => {
        dispatch({ type: "clear-strings-state" });
      }
      //displayEnd: ({ context, event }) => {},
    },
    guards: {
      "strings-left": () => {
        return !!Object.values(store.stringsState).find(v => v === 'pending');
      },
    }
  }));

  return [state, send];
};

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
