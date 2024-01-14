import classnames from "classnames";
import css from './StringInfo.module.css';

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
    <div className={classnames(css.string, {[css.ok]: isOk, [css.fail]: isFail, [css.next]: isNext})}>
      <i className={css.check}></i>

      { (progress && isNext) ? (
          <svg viewBox="0 0 20 20" width="16" height="16" className={css["timer-circle"]}>
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

export default StringPanel;
