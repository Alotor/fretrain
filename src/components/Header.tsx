import { NoteColors } from "@/constants";
import css from "./Header.module.css";

type HeaderProps = {
  selectedNote: string;
  onRefresh: () => void;
  onNext: () => void;
};

function Header({ selectedNote, onRefresh, onNext }: HeaderProps) {
  return (
    <div className={css.info}>
      <div className={css.text}>
        Find:&nbsp;
        <span id={css.selectedNoteLabel} style={{background: NoteColors[selectedNote]}}>
          {selectedNote}
        </span>
      </div>
      <button id={css.resetBtn} onClick={onRefresh}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>
      <button id={css.nextBtn}  onClick={onNext}>
        <i className="fa-solid fa-forward"></i>
      </button>
    </div>
  );
}

export default Header;
