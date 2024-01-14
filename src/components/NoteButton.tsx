import {useEffect, useCallback, useRef} from 'react';
import classnames from "classnames";
import css from './NoteButton.module.css';
import { NoteColors, StringNotes } from "@/constants"

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
      className={classnames(css.noteButton, {[css.hidden]: !display})}>
      {note}
    </button>
  );
}

export default FretButton;
