import { Link } from 'react-router-dom';

export function Support() {
  return (
    <div className="page legal-page">
      <header className="hero">
        <p className="eyebrow">Old Wives' Reveal</p>
        <h1>Support</h1>
        <p className="lede">Questions, trouble, or feedback - here's how to sort it out.</p>
      </header>

      <nav className="page-nav">
        <Link to="/home">← Back</Link>
      </nav>

      <section className="legal-body">
        <h2>What is this, exactly?</h2>
        <p>
          A folk method for guessing boy or girl, based on an old tradition: a mother's cycle
          renews every three years, a father's every four, and whichever is freshest at the
          reckoning is said to be the one the child favors. Enter both birth dates and a date to
          reckon from, and the app works out the reading.
        </p>

        <h2>Is this actually accurate?</h2>
        <p>
          No - and it doesn't claim to be. A baby's biological sex is set by chromosomes at
          conception, regardless of what any folk method says. This app is for fun, not a
          prediction tool or medical advice.
        </p>

        <h2>A reading is taking a while to show up</h2>
        <p>
          If it's stuck for up to a minute, that's normal - the app talks to a small server that
          can go to sleep after a period of inactivity and takes a moment to wake up. Give it a
          minute and it should come through. If it still hasn't after that, check your internet
          connection and try again.
        </p>

        <h2>How does sharing work?</h2>
        <p>
          The "Share" button generates an image of your reading and a link to it, using whatever
          share options your device offers. Anyone with that link can view that one reading.
        </p>

        <h2>Can I delete a reading?</h2>
        <p>
          Yes - email us (below) with the reading's id (visible in its share link) or roughly
          when you submitted it, and we'll remove it. See the{' '}
          <Link to="/privacy">Privacy Policy</Link> for more on what's stored and why.
        </p>

        <h2>Still stuck?</h2>
        <p>
          Email <a href="mailto:oldwivesreveal@gmail.com">oldwivesreveal@gmail.com</a> and we'll
          get back to you.
        </p>
      </section>
    </div>
  );
}
