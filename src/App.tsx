import React, { useRef, useEffect, useState, useCallback } from 'react';
import style from './App.module.css';
import classnames from "classnames";
import { NoteColors, StringNotes } from "./constants.ts";
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';
import AppFsm from "./App.fsm.json";
import * as random from "./random";

type FretMarkerProps = {
  row: number;
}

function FretMarker({ row }: FretMarkerProps) {
  // Fret markers on frets 3, 5, 7, 9 and 12
  const mark = (row === 4 || row === 6 || row === 8 || row === 10 || row === 13) ? (
    <div className={style.mark}></div>
  ) : null; 

  const fret = (row > 1) ? (
    <div className={classnames(style.fret, {[style.nut]: row === 2 })}></div>
  ) : null;
  
  return (
    <div className={style.cont}>
      {mark}
      {fret}
    </div>
  );
}

type StringState = 'ok' | 'fail' | 'next' | 'pending';
type StringPanelProps = {
  state: StringState;
  progress: number | null
}

function StringPanel({ state, progress }: StringPanelProps) {
  const isOk = state === "ok";
  const isFail = state === "fail";
  const isNext = state === "next";
  const dasharray = `calc(${progress} * 31.4 / 100) 31.4`;
  
  return (
    <div className={classnames(style.string, {[style.ok]: isOk, [style.fail]: isFail, [style.next]: isNext})}>
      <i className={style.check}></i>

      { (progress && isNext) ? (
          <svg viewBox="0 0 20 20" width="16" height="16" className={style["timer-circle"]}>
            <circle r="5" cx="10" cy="10" fill="transparent"
                    stroke="#e05659"
                    strokeWidth="10"
                    strokeDasharray={dasharray}
                    transform="rotate(-90) translate(-20)" />
          </svg>
        ) : null}
    </div>
  );
}

type FretButtonProps = {
  stringNum: number;
  fretNum: number;
  display: boolean;
  onClick: (stringNum: number, note: string, event: React.MouseEvent) => void;
};

function FretButton({ stringNum, fretNum, display, onClick }: FretButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const note = StringNotes[stringNum][fretNum][0];
  const color = NoteColors[note];

  const handleClickNote = useCallback((ev: React.MouseEvent) => {
    onClick(stringNum, note, ev);
  }, [onClick]);

  useEffect(() => {
    btnRef.current?.style.setProperty("--color", color);
  }, [color]);
  
  return (
    <button
      ref={btnRef}
      onClick={handleClickNote}
      data-note={note}
      className={classnames(style["fretboard-btn"], {[style.hidden]: !display})}>
      {note}
    </button>
  );
}

type Store = {
  selectedNote: string;
  selectedString: number;
  selectedStringProgress: number;
  stringsState: Record<string, StringState>;
  displayNotes: Set<string>;
};

function initStore(): Store {
  return {
    selectedNote: "C",
    selectedString: 1,
    selectedStringProgress: 0,
    stringsState: {
      6: 'pending',
      5: 'pending',
      4: 'pending',
      3: 'pending',
      2: 'pending',
      1: 'pending',
    },
    displayNotes: new Set()
  };
}

const machine = createMachine(AppFsm);

function App() {
  const [store, setStore] = useState<Store>(initStore);

  const timerRef = useRef<number | null>(null);
  const timeSinceStartRef = useRef<number | null>(null);
  const [_state, send] = useMachine(machine.provide({
    actions: {
      selectNote: () => {
        const note = random.randomNote();
        setStore((s) => ({ ...s, selectedNote: note}));
        send({type: "note.selected"});
      },
      selectString: () => {
        setStore((s: Store) => {
          const selString = random.nextString(s.stringsState);

          if (!selString) {
            return s;
          }
          return {
            ...s,
            selectedString: selString,
            selectedStringProgress: 0,
            stringsState: {
              ...s.stringsState,
              [selString]: "next",
          }}
        });
        send({type: "string.selected"});
      },

      startTimer: () => {
        timeSinceStartRef.current = new Date().getTime();
        const id = setInterval(() => {
          const startTime = timeSinceStartRef.current;
          if (startTime) {
            const ellapsed = (new Date().getTime() - startTime) / 1000;
            send({type: "time", ellapsed});
          }
        }, 1000);
        timerRef.current = id;
      },
      stopTimer: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      updateProgress: ({ event: { ellapsed } }) => {
        setStore((s) => ({
          ...s,
          selectedStringProgress: (ellapsed / 10) * 100
        }));
        if (ellapsed >= 10) {
          send({ type: "timeout" })
        }
      },
      displayOK: () => {
        setStore((s) => ({
          ...s,
          stringsState: {
            ...s.stringsState,
            [s.selectedString]: 'ok'
          }
        }));
      },
      displayFail: () => {
        setStore((s) => ({
          ...s,
          stringsState: {
            ...s.stringsState,
            [s.selectedString]: 'fail'
          }
        }));
      },
      //clearState: ({ context, event }) => {},
      //displayEnd: ({ context, event }) => {},
    },
    guards: {
      "strings-left": () => {
        return !!Object.values(store.stringsState).find(v => v === 'pending');
      },
    }
  }));

  //  console.log(state.value);
  
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

  //console.log(displayNotes);

  // console.log(">>selected", selectedString, selectedNote, selectedStringProgress);
  useEffect(() => {
    const buttonElem = document.querySelector("[data-note]");
    if (mainRef.current && buttonElem) {
      const height = buttonElem.clientHeight;
      const width = Math.min(height, buttonElem.clientWidth);
      mainRef.current.style.setProperty("--element-width", `${width - 8}px`);
    }
  }, []);

  const handleClickNote = useCallback((stringNum: number, note: string) => {
    // console.log(stringNum, note, (stringNum === store.selectedString), (store.selectedNote === note), selectedString, selectedNote);
    if (stringNum === selectedString) {
      if (selectedNote === note) {
        send({ "type": "select.ok"});
      } else {
        send({ "type": "select.fail"});
      }

      const ks: Array<string> = Object.keys(StringNotes[selectedString]);
      const idx = ks.find((k) => new Set(StringNotes[selectedString][k]).has(selectedNote));

      const displayCoord = `${stringNum},${idx}`;
      setStore((s) => ({
        ...s,
        displayNotes: new Set([...s.displayNotes, displayCoord])
      }));
      
      
    }
  }, [selectedString, selectedNote]);
  
  return (
    <div ref={mainRef} className={style.main}>
      <div className={style.info}>
        <div className={style.text}>
          Find:&nbsp;
          <span id={style.selectedNoteLabel} style={{background: NoteColors[selectedNote]}}>
            {selectedNote}
          </span>
        </div>
        <button id={style.resetBtn}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
        <button id={style.nextBtn}>
          <i className="fa-solid fa-forward"></i>
        </button>
      </div>

      <div className={style.fretboard}>
        {rows.map((_, row) => cols.map((_, col) => {
          const stringNum = (6 - col + 1);

          if (row === 0 && col > 0 && col < 7) {
            return <StringPanel
                     key={`string-${stringNum}`}
                     state={stringsState[stringNum]}
                     progress={(stringNum === selectedString) ? selectedStringProgress : null } />
          } else if (col === 0 || col === 7 || row === 0 || row === 14) {
            return <FretMarker key={`marker-${row}-${col}`} row={row} />
          } else if (row === 1 && row <= 14) {
            return <div key={`empty-${row}-${col}`}></div>;
          } else {
            const fretNum = row - 1;
            return <FretButton key={`fret-${stringNum}-${fretNum}`}
                               stringNum={stringNum}
                               fretNum={fretNum}
                               display={displayNotes.has(`${stringNum},${fretNum}`)}
                               onClick={handleClickNote} />
          }
        }))}
      </div>
    </div>
  )
}

export default App;

