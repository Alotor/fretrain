import classnames from "classnames";
import css from './FretMarker.module.css';

type FretMarkerProps = {
  row: number;
  col: number;
}

function FretMarker({ row, col }: FretMarkerProps) {
  // Fret markers on frets 3, 5, 7, 9 and 12
  const mark = (row === 4 || row === 6 || row === 8 || row === 10 || row === 13) ? (
    <div className={classnames(css.mark, {
      [css.twelve]: row=== 13,
      [css.right]: col === 7
    })}></div>
  ) : null;

  const fret = (row > 1) ? (
    <div className={classnames(css.fret, {[css.nut]: row === 2 })}></div>
  ) : null;

  return (
    <div className={css.cont}>
      {mark}
      {fret}
    </div>
  );
}

export default FretMarker;
