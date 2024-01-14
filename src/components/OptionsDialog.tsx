import css from './OptionsDialog.module.css';
import { useState } from "react";

type Options = {
  appMode: "fix-note" | "fix-string" | "guess-note";
  speed: number;
  accidentals: boolean;
  deterministicNoteMode: "off" | "seconds" | "thirds" | "fourths" | "fifths";
  useStrings: Set<number>;
  useNotes: Set<string>;
}

type OptionsDialogProps = {
  onClose: () => void;
};

function initialOptions(): Options {
  return {
    appMode: "fix-note",
    speed: 5, // seconds per note
    accidentals: false,
    deterministicNoteMode: "off",
    useStrings: new Set([1, 2, 3, 4, 5, 6]),
    useNotes: new Set(["A", "B", "C", "D", "E", "F", "G"]),
  }
}

function OptionsDialog({ onClose }: OptionsDialogProps) {
  const [state, _setState] = useState(initialOptions);
  
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
                       checked={state.appMode === "fix-note"}></input>
                <label htmlFor="fix-note">Fix note changing strings</label>
              </div>
              <div>
                <input type="radio" name="appMode" id="fix-string" value="fix-string"
                       checked={state.appMode === "fix-string"}></input>
                <label htmlFor="fix-string">Fix string changing notes</label>
              </div>
              <div>
                <input type="radio" name="appMode" id="guess-note" value="guess-note"
                       checked={state.appMode === "guess-note"}></input>
                <label htmlFor="guess-note">Guess the note</label>
              </div>
            </div>
          </div>

          <div className={css.optionsSection}>
            <label className={css.optionTitle}>Speed</label>
            <div>
              <input type="text" value={state.speed}></input>
              <button><i className="fa-solid fa-plus"></i></button>
              <button><i className="fa-solid fa-minus"></i></button>
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Accidentals</div>
            <div>
              <div>
                <input type="radio" name="accidentals" id="accidentals-yes" value="true"
                       checked={state.accidentals}></input>
                <label htmlFor="accidentals-yes">Yes</label>
              </div>
              <div>
                <input type="radio" name="accidentals" id="accidentals-no" value="false"
                       checked={!state.accidentals}></input>
                <label htmlFor="accidentals-no">No</label>
              </div>
            </div>
          </div>


          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Deterministic note mode</div>
            <div>
              <div>
                <input type="radio"></input>
                <label>Off</label>
              </div>
              <div>
                <input type="radio"></input>
                <label>Seconds</label>
              </div>
              <div>
                <input type="radio"></input>
                <label>Thirds</label>
              </div>
              <div>
                <input type="radio"></input>
                <label>Fourths</label>
              </div>
              <div>
                <input type="radio"></input>
                <label>Fifths</label>
              </div>
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Use strings</div>
            <div>
              <div>
                <input type="checkbox"></input>
                <label>1</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>2</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>3</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>4</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>5</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>6</label>
              </div>
            </div>
          </div>

          <div className={css.optionsSection}>
            <div className={css.optionTitle}>Use Notes</div>
            <div>
              <div>
                <input type="checkbox"></input>
                <label>C</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>D</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>E</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>F</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>G</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>A</label>
              </div>
              <div>
                <input type="checkbox"></input>
                <label>B</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsDialog;
