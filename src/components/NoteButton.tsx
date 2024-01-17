import {useEffect, useCallback, useRef} from 'react';
import classnames from "classnames";
import css from './NoteButton.module.css';
import { NoteColors, StringNotes } from "@/constants"

type FretButtonProps = {
  stringNum: number;
  fretNum: number;
  display: boolean;
  showHint: boolean;
  showFlat: boolean;
  onClick: (stringNum: number, note: string, event: React.MouseEvent) => void;
};

function FretButton({ stringNum, fretNum, display, showHint, showFlat, onClick }: FretButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const notes = StringNotes[stringNum][fretNum]
  const note = (notes.length === 1 || !showFlat) ? notes[0] : notes[1];
  const color = NoteColors[note];
  const accidental = note.endsWith("#") || note.endsWith("b");

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
      className={classnames(css.noteButton, {
        [css.hidden]: !display,
        [css.hint]: (showHint && !display && !accidental)
      })}>
      {note}
    </button>
  );
}

export default FretButton;
