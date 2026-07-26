import type { Reveal } from '@oldwivesreveal/shared-types';
import { CycleDial } from './CycleDial';
import { VerdictCard } from './VerdictCard';
import { ResultWindows } from './ResultWindows';

interface RevealResultProps {
  reveal: Reveal;
}

export function RevealResult({ reveal }: RevealResultProps) {
  return (
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
  );
}
