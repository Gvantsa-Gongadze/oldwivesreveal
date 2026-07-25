import { buildResultWindows, type Reveal } from '@oldwivesreveal/shared-types';
import { formatDate } from '../lib/format';

interface ResultWindowsProps {
  reveal: Reveal;
}

const WINDOW_COUNT = 6;

export function ResultWindows({ reveal }: ResultWindowsProps) {
  const windows = buildResultWindows(
    { fatherBirthDate: reveal.fatherBirthDate, motherBirthDate: reveal.motherBirthDate },
    { from: reveal.reckonDate, windowCount: WINDOW_COUNT },
  );

  return (
    <section className="windows">
      <h3>When it leans which way</h3>
      <ul className="window-list">
        {windows.map((w, i) => (
          <li className={`window-row${i === 0 ? ' current' : ''}`} key={w.from}>
            <span className={`result-tag ${w.result.toLowerCase()}`}>{w.result}</span>
            <span className="window-range">
              {formatDate(w.from)} – {formatDate(w.to)}
            </span>
            {i === 0 ? <span className="window-now">now</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
