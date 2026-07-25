import { useEffect, useRef } from 'react';
import type { DialReading } from '@oldwivesreveal/shared-types';
import { formatSinceRenewal } from '../lib/format';

interface CycleDialProps {
  label: string;
  reading: DialReading;
  handColor: string;
  wedgeColor: string;
  isWinner: boolean;
  isDimmed: boolean;
}

function wedgePath(angleDeg: number): string {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 100 + 80 * Math.sin(rad);
  const y = 100 - 80 * Math.cos(rad);
  const largeArc = angleDeg > 180 ? 1 : 0;
  return `M100,100 L100,20 A80,80 0 ${largeArc} 1 ${x},${y} Z`;
}

function tickPoints(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x1: 100 + 80 * Math.cos(rad),
      y1: 100 + 80 * Math.sin(rad),
      x2: 100 + 92 * Math.cos(rad),
      y2: 100 + 92 * Math.sin(rad),
    };
  });
}

export function CycleDial({ label, reading, handColor, wedgeColor, isWinner, isDimmed }: CycleDialProps) {
  const handRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const hand = handRef.current;
    if (!hand) return;
    // Reset to 0 then animate to the target angle so the sweep replays each time.
    hand.style.transition = 'none';
    hand.style.transform = 'rotate(0deg)';
    // Force reflow before re-enabling the transition.
    void hand.getBoundingClientRect();
    hand.style.transition = '';
    requestAnimationFrame(() => {
      hand.style.transform = `rotate(${reading.angleDeg}deg)`;
    });
  }, [reading.angleDeg]);

  const ticks = tickPoints(reading.cycleYears);

  return (
    <div className={`dial-wrap${isWinner ? ' winner' : ''}${isDimmed ? ' dim' : ''}`}>
      <svg viewBox="0 0 200 200">
        <circle className="ring-track" cx="100" cy="100" r="80" />
        <path className="ring-wedge" d={wedgePath(reading.angleDeg)} fill={wedgeColor} fillOpacity={0.35} />
        <g>
          {ticks.map((t, i) => (
            <line key={i} className="ring-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
          ))}
        </g>
        <line ref={handRef} className="ring-hand" x1="100" y1="100" x2="100" y2="24" stroke={handColor} />
        <circle className="ring-hub" cx="100" cy="100" r="5" />
      </svg>
      <p className="dial-label">{label}</p>
      <p className="dial-meta">
        {formatSinceRenewal(reading.remainderYears)} · age {Math.floor(reading.ageYears)}y
      </p>
    </div>
  );
}
