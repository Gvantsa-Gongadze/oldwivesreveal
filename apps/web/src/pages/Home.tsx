import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Reveal } from '@oldwivesreveal/shared-types';
import { RevealForm } from '../components/RevealForm';
import { RevealResult } from '../components/RevealResult';
import { maybeRequestReview } from '../lib/reviewPrompt';

export function Home() {
  const [reveal, setReveal] = useState<Reveal | null>(null);

  function handleRevealed(next: Reveal) {
    setReveal(next);
    void maybeRequestReview();
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">An old wives' method</p>
        <h1>
          <Link to="/home">Old Wives' Reveal</Link>
        </h1>
        <p className="lede">
          A folk method for guessing boy or girl. Old wisdom holds a mother renews every three years, a father every
          four — whichever is freshest at the reckoning is said to be the one the child favors.
        </p>
        <p className="hero-disclaimer">Just for fun, not medicine — a baby's sex is set at conception either way.</p>
      </header>

      <nav className="page-nav">
        <Link to="/history">Past reckonings →</Link>
      </nav>

      <RevealForm onRevealed={handleRevealed} />

      {reveal ? <RevealResult reveal={reveal} /> : null}

      <footer className="footnote">
        This follows an old folk method, not medicine. A baby's biological sex is set by chromosomes at conception —
        close to a coin flip either way.
      </footer>
    </div>
  );
}
