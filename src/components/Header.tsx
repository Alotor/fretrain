import { NoteColors } from "@/constants";
import css from "./Header.module.css";
import classnames from "classnames";

type HeaderProps = {
  selectedNote: string;
  paused: boolean;
  showNotes: boolean;
  onShowNotes: () => void;
  onTogglePause: () => void;
  onOpenOptions: () => void;
  onRefresh: () => void;
  onNext: () => void;
};

function Header({ selectedNote, showNotes, paused, onRefresh, onNext, onShowNotes, onTogglePause, onOpenOptions }: HeaderProps) {
  return (
    <div className={css.info}>
      <div className={css.text}>
        Find:&nbsp;
        <span id={css.selectedNoteLabel} style={{background: NoteColors[selectedNote]}}>
          {selectedNote}
        </span>
      </div>
      <button className={css.headerBtn} onClick={onShowNotes}>
        <i className={classnames("fa-solid", {"fa-eye": !showNotes, "fa-eye-slash": showNotes})}></i>
      </button>
      <button className={css.headerBtn} onClick={onTogglePause}>
        <i className={classnames("fa-solid", {"fa-pause": !paused, "fa-play": paused})}></i>
      </button>
      <button className={css.headerBtn} onClick={onRefresh}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>
      <button className={css.headerBtn} onClick={onNext}>
        <i className="fa-solid fa-forward"></i>
      </button>
      <button className={css.headerBtn} onClick={onOpenOptions}>
        <i className="fa-solid fa-gear"></i>
      </button>
    </div>
  );
}

export default Header;
