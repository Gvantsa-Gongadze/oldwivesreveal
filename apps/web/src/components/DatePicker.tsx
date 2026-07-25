import { useEffect, useRef, useState } from 'react';

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

interface DayCell {
  date: Date;
  inMonth: boolean;
}

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseIso(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(date: Date | null): string {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function buildDayGrid(year: number, month: number): DayCell[] {
  const leading = mondayIndex(new Date(year, month, 1));
  const total = daysInMonth(year, month);
  const cells: DayCell[] = [];

  for (let i = leading; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let d = 1; d <= total; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  let trailing = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month, total + trailing), inMonth: false });
    trailing++;
  }
  return cells;
}

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const selected = parseIso(value);
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'days' | 'years'>('days');
  const [viewYear, setViewYear] = useState((selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selected ?? today).getMonth());
  const [yearBase, setYearBase] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function openPicker() {
    const base = selected ?? today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setMode('days');
    setIsOpen((open) => !open);
  }

  function goToMonth(delta: number) {
    let month = viewMonth + delta;
    let year = viewYear;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setViewMonth(month);
    setViewYear(year);
  }

  function openYearMode() {
    setYearBase(viewYear - (viewYear % 12));
    setMode('years');
  }

  function pickDay(date: Date) {
    onChange(toIso(date));
    setIsOpen(false);
  }

  function pickYear(year: number) {
    setViewYear(year);
    setMode('days');
  }

  function pickToday() {
    onChange(toIso(today));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  }

  const cells = buildDayGrid(viewYear, viewMonth);
  const years = Array.from({ length: 12 }, (_, i) => yearBase + i);

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="date-trigger"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={selected ? '' : 'date-trigger-placeholder'}>{selected ? formatDisplay(selected) : 'dd.mm.yyyy'}</span>
        <svg className="date-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {isOpen ? (
        <div className="date-popover" role="dialog">
          {mode === 'days' ? (
            <>
              <div className="date-popover-header">
                <button type="button" className="date-nav-btn" onClick={() => goToMonth(-1)} aria-label="Previous month">
                  ‹
                </button>
                <button type="button" className="date-header-label" onClick={openYearMode}>
                  {MONTH_LABELS[viewMonth]} {viewYear}
                </button>
                <button type="button" className="date-nav-btn" onClick={() => goToMonth(1)} aria-label="Next month">
                  ›
                </button>
              </div>
              <div className="date-weekdays">
                {WEEKDAY_LABELS.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
              <div className="date-grid">
                {cells.map(({ date, inMonth }, i) => {
                  const isSelected = selected ? isSameDay(date, selected) : false;
                  const isToday = isSameDay(date, today);
                  return (
                    <button
                      type="button"
                      key={i}
                      className={`date-cell${inMonth ? '' : ' outside'}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                      onClick={() => pickDay(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="date-popover-footer">
                <button type="button" className="date-today-btn" onClick={pickToday}>
                  Today
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="date-popover-header">
                <button type="button" className="date-nav-btn" onClick={() => setYearBase((b) => b - 12)} aria-label="Previous years">
                  ‹
                </button>
                <span className="date-header-label">
                  {yearBase} – {yearBase + 11}
                </span>
                <button type="button" className="date-nav-btn" onClick={() => setYearBase((b) => b + 12)} aria-label="Next years">
                  ›
                </button>
              </div>
              <div className="date-year-grid">
                {years.map((year) => (
                  <button
                    type="button"
                    key={year}
                    className={`date-year-cell${year === viewYear ? ' selected' : ''}`}
                    onClick={() => pickYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
