import { useState } from 'react';
import type { Reveal } from '@oldwivesreveal/shared-types';
import { RevealForm } from './components/RevealForm';
import { CycleDial } from './components/CycleDial';
import { VerdictCard } from './components/VerdictCard';
import { ResultWindows } from './components/ResultWindows';
import { HistoryList } from './components/HistoryList';

export default function App() {
  const [reveal, setReveal] = useState<Reveal | null>(null);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">An old wives' method</p>
        <h1>Old Wives' Reveal</h1>
        <p className="lede">
          Old wisdom holds a father renews every four years, a mother every three. Whichever is freshest at the
          reckoning is said to be the one the child favors.
        </p>
      </header>

      <RevealForm onRevealed={setReveal} />

      {reveal ? (
        <>
          <section className="dials">
            <CycleDial
              label="Father — 4-year cycle"
              reading={reveal.father}
              handColor="var(--father-bright)"
              wedgeColor="var(--father)"
              isWinner={reveal.newerParent === 'father'}
              isDimmed={reveal.newerParent === 'mother'}
            />
            <div className="bridge">⇄</div>
            <CycleDial
              label="Mother — 3-year cycle"
              reading={reveal.mother}
              handColor="var(--mother-bright)"
              wedgeColor="var(--mother)"
              isWinner={reveal.newerParent === 'mother'}
              isDimmed={reveal.newerParent === 'father'}
            />
          </section>

          <VerdictCard reveal={reveal} />
          <ResultWindows reveal={reveal} />
        </>
      ) : null}

      <HistoryList />

      <footer className="footnote">
        This follows an old folk method, not medicine. A baby's biological sex is set by chromosomes at conception —
        close to a coin flip either way.
      </footer>
    </div>
  );
}
