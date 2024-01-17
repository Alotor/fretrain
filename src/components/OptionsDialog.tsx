import css from './OptionsDialog.module.css';
import React, { useCallback } from "react";
import { useOptionsStorage } from "@/OptionsStorage";
import { produce } from "immer";
import {NoteColors} from "@/constants";

const notes = ["A", "B", "C", "D", "E", "F", "G"];
const sharps = ["A#", "", "C#", "D#", "", "F#", "G#"];
const flats = ["Ab", "Bb", "", "Db", "Eb", "", "Gb"];

type OptionsDialogProps = {
  onClose: () => void;
};

function OptionsDialog({ onClose }: OptionsDialogProps) {
  const [state, setState] = useOptionsStorage();
  
  function updateAttr(key: string, e: React.FormEvent) {
    setState(produce((s: any) => {
      s[key] = (e.target! as HTMLInputElement).value;
    }));
  }

  const handleChangeAppMode = useCallback(updateAttr.bind(null, "appMode"), []);
  const handleChangeSpeed = useCallback(updateAttr.bind(null, "speed"), []);
  const handleChangeEndSessionBehavior = useCallback(updateAttr.bind(null, "endSessionBehavior"), []);
  const handleChangeDetMode = useCallback(updateAttr.bind(null, "deterministicNoteMode"), []);
  const handleChangeDetStringMode = useCallback(updateAttr.bind(null, "deterministicStringMode"), []);

  const handleChangeUseString = useCallback((e: React.FormEvent) => {
    const target = e.target! as HTMLInputElement
    const string = parseInt(target.dataset["string"] || "1", 10);
    setState(produce((s) => {
      const useStrings = new Set(s.useStrings);
      if (target.checked) {
        useStrings.add(string);
      } else {
        useStrings.delete(string);
      }
      s.useStrings = [...useStrings];
    }));
  }, []);

  const handleChangeAccidentals = useCallback((e: React.FormEvent) => {
    const target = e.target! as HTMLInputElement
    setState(produce((s) => {
      s.accidentals = target.value as "on" | "off";
      const useNotes = new Set(s.useNotes);

      if (s.accidentals === "off") {
        for (let sn of sharps.filter(s => s !== "")) {
          useNotes.delete(sn);
        }
        for (let sn of flats.filter(s => s !== "")) {
          useNotes.delete(sn);
        }
      } else {
        for (let sn of sharps.filter(s => s !== "")) {
          useNotes.add(sn);
        }
        for (let sn of flats.filter(s => s !== "")) {
          useNotes.add(sn);
        }
      }
      s.useNotes = [...useNotes];
    }));
  }, [])

  const handleChangeUseNotes = useCallback((e: React.FormEvent) => {
    const target = e.target! as HTMLInputElement
    const note = target.dataset["note"] || "C";
    setState(produce((s) => {
      const useNotes = new Set(s.useNotes);
      if (target.checked) {
        useNotes.add(note);
      } else {
        useNotes.delete(note);
      }
      s.useNotes = [...useNotes];
    }));
  }, []);

  const handleClickPlus = useCallback(() => {
    setState(produce((s) => {
      s.speed = s.speed + 1;
    }));
  }, []);

  const handleClickMinus = useCallback(() => {
    setState(produce((s) => {
      s.speed = Math.max(0, s.speed - 1);
    }));
  }, []);
  

  const useStrings = new Set(state.useStrings);
  const useNotes = new Set(state.useNotes);

  return (
    <div className={css.optionsWrapper}>
      <div className={css.options}>
        <button className={css.closeBtn} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className={css.configWrapper}>
          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Mode</div>
            <div>
              <div>
                <input type="radio" name="appMode" id="fix-note" value="fix-note"
                       checked={state.appMode === "fix-note"}
                       onChange={handleChangeAppMode}
                ></input>
                <label htmlFor="fix-note">Fix note changing strings</label>
              </div>
              <div>
                <input type="radio" name="appMode" id="fix-string" value="fix-string"
                       checked={state.appMode === "fix-string"}
                       onChange={handleChangeAppMode}
                ></input>
                <label htmlFor="fix-string">Fix string changing notes</label>
              </div>
              <div>
                <input type="radio" name="appMode" id="guess-note" value="guess-note"
                       checked={state.appMode === "guess-note"}
                       onChange={handleChangeAppMode}
                ></input>
                <label htmlFor="guess-note">Guess the note</label>
              </div>
            </div>
          </div>

          <div className={css.optionsSection}>
            <label className={css.optionTitle}>Speed</label>
            <div className={css.optionsSpeed}>
              <input type="number" value={state.speed}
                     onChange={handleChangeSpeed }></input>
              <button><i className="fa-solid fa-plus" onClick={handleClickPlus}></i></button>
              <button><i className="fa-solid fa-minus" onClick={handleClickMinus}></i></button>
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>End session behavior</div>
            <div>
              <div>
                <input type="radio" name="endSessionBehavior" id="end-session-stop" value="stop"
                       checked={state.endSessionBehavior === "stop"}
                       onChange={handleChangeEndSessionBehavior}
                ></input>
                <label htmlFor="end-session-stop">Stop</label>
              </div>

              <div>
                <input type="radio" name="endSessionBehavior" id="end-session-repeat" value="repeat"
                       checked={state.endSessionBehavior === "repeat"}
                       onChange={handleChangeEndSessionBehavior}
                ></input>
                <label htmlFor="end-session-repeat">Repeat</label>
              </div>

              <div>
                <input type="radio" name="endSessionBehavior" id="end-session-next" value="next"
                       checked={state.endSessionBehavior === "next"}
                       onChange={handleChangeEndSessionBehavior}
                ></input>
                <label htmlFor="end-session-next">Next</label>
              </div>
              
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Accidentals</div>
            <div>
              <div>
                <input type="radio" name="accidentals" id="accidentals-yes" value="on"
                       checked={state.accidentals === "on"}
                       onChange={handleChangeAccidentals}
                ></input>
                <label htmlFor="accidentals-yes">Yes</label>
              </div>
              <div>
                <input type="radio" name="accidentals" id="accidentals-no" value="off"
                       checked={state.accidentals === "off"}
                       onChange={handleChangeAccidentals}
                ></input>
                <label htmlFor="accidentals-no">No</label>
              </div>
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Use strings</div>
            <div className={css.optionsStrings}>
              { new Array(6).fill(null).map((_, i) => (
                <div key={"use-string-" + (i + 1)}>
                  <input type="checkbox"
                         checked={useStrings.has(i + 1)}
                         name={"use-string-" + (i + 1)}
                         id={"use-string-" + (i + 1)}
                         onChange={handleChangeUseString}
                         data-string={i + 1}></input>
                  <label className={css.stringLabel}
                         data-checked={useStrings.has(i + 1)}
                         htmlFor={"use-string-" + (i + 1)}>{ i + 1 }</label>
                </div>
                ))}
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Use Notes</div>

            { (state.accidentals === "on") ? (<div className={css.optionsNotes}>
              { flats.map((note, i) => (
                <div key={"use-note-" + note + i}>
                  {(note !== "") ? (<>
                    <input type="checkbox"
                           data-note={note}
                           name={"use-note-" + note}
                           id={"use-note-" + note}
                           onChange={handleChangeUseNotes}
                           checked={useNotes.has(note)}></input>
                    <label style={{"--note-color": NoteColors[note]} as any}
                           className={css.noteLabel}
                           data-checked={useNotes.has(note)}
                           htmlFor={"use-note-" + note}>{note}</label>
                  </>) : <div key={`flat-${i}`} className={css.emptyNote}></div> }
                </div>
                ))}
            </div>) : null}
            
            <div className={css.optionsNotes}>
              { notes.map((note) => (
                <div key={"use-note-" + note}>
                  <input type="checkbox"
                         data-note={note}
                         name={"use-note-" + note}
                         id={"use-note-" + note}
                         onChange={handleChangeUseNotes}
                         checked={useNotes.has(note)}></input>
                  <label style={{"--note-color": NoteColors[note]} as any}
                         className={css.noteLabel}
                         data-checked={useNotes.has(note)}
                         htmlFor={"use-note-" + note}>{note}</label>
                </div>
                ))}
            </div>

            {(state.accidentals === "on") ? (<div className={css.optionsNotes}>
              { sharps.map((note, i) => (
                <div key={"use-note-" + note + i}>
                  {(note !== "") ? (<>
                    <input type="checkbox"
                           data-note={note}
                           name={"use-note-" + note}
                           id={"use-note-" + note}
                           onChange={handleChangeUseNotes}
                           checked={useNotes.has(note)}></input>
                    <label style={{"--note-color": NoteColors[note]} as any}
                           className={css.noteLabel}
                           data-checked={useNotes.has(note)}
                           htmlFor={"use-note-" + note}>{note}</label>
                  </>) : <div key={`sharp-${i}`} className={css.emptyNote}></div>}
                </div>
                ))}
            </div>) : null}
          </div>
          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Deterministic note mode</div>
            <div>
              <div>
                <input type="radio" name="detMode" id="det-mode-off" value="off"
                       checked={state.deterministicNoteMode === "off"}
                       onChange={handleChangeDetMode}
                ></input>
                <label htmlFor="det-mode-off">Off</label>
              </div>
              <div>
                <input type="radio" name="detMode" id="det-mode-seconds" value="seconds"
                       checked={state.deterministicNoteMode === "seconds"}
                       onChange={handleChangeDetMode}
                ></input>
                <label htmlFor="det-mode-seconds">Seconds</label>
              </div>
              <div>
                <input type="radio" name="detMode" id="det-mode-thirds" value="thirds"
                       checked={state.deterministicNoteMode === "thirds"}
                       onChange={handleChangeDetMode}
                ></input>
                <label htmlFor="det-mode-thirds">Thirds</label>
              </div>
              <div>
                <input type="radio" name="detMode" id="det-mode-fourths" value="fourths"
                       checked={state.deterministicNoteMode === "fourths"}
                       onChange={handleChangeDetMode}
                ></input>
                <label htmlFor="det-mode-fourths">Fourths</label>
              </div>
              <div>
                <input type="radio" name="detMode" id="det-mode-fifths" value="fifths"
                       checked={state.deterministicNoteMode === "fifths"}
                       onChange={handleChangeDetMode}
                ></input>
                <label htmlFor="det-mode-fifths">Fifths</label>
              </div>
            </div>
          </div>
          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Deterministic string mode</div>
            <div>
              <div>
                <input type="radio" name="detStringMode" id="det-string-mode-off" value="off"
                       checked={state.deterministicStringMode === "off"}
                       onChange={handleChangeDetStringMode}
                ></input>
                <label htmlFor="det-string-mode-off">Off</label>
              </div>

              <div>
                <input type="radio" name="detStringMode" id="det-string-mode-down-up" value="down-up"
                       checked={state.deterministicStringMode === "down-up"}
                       onChange={handleChangeDetStringMode}
                ></input>
                <label htmlFor="det-string-mode-down-up">Strings 1 -&gt; 6</label>
              </div>

              <div>
                <input type="radio" name="detStringMode" id="det-string-mode-up-down" value="up-down"
                       checked={state.deterministicStringMode === "up-down"}
                       onChange={handleChangeDetStringMode}
                ></input>
                <label htmlFor="det-string-mode-up-down">Strings 6 -&gt; 1</label>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsDialog;
