import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="page legal-page">
      <header className="hero">
        <p className="eyebrow">Old Wives' Reveal</p>
        <h1>Privacy Policy</h1>
        <p className="lede">Last updated August 3, 2026.</p>
      </header>

      <nav className="page-nav">
        <Link to="/home">← Back</Link>
      </nav>

      <section className="legal-body">
        <p>
          Old Wives' Reveal is a just-for-fun folk calculator for guessing a baby's sex from the
          parents' birth dates. This page explains, in plain language, what the app does and
          doesn't do with your information.
        </p>

        <h2>What we collect</h2>
        <p>When you submit a reading, we store:</p>
        <ul>
          <li>The mother's and father's birth dates and the date you're reckoning from</li>
          <li>The calculated result (boy, girl, or tie) and the numbers behind it</li>
          <li>
            An anonymous identifier generated on your device (not your name, email, or account -
            we don't have accounts). It's only used to show you your own past readings.
          </li>
        </ul>
        <p>We don't collect your name, email address, location, or any device identifiers beyond that anonymous id.</p>

        <h2>What we don't do</h2>
        <p>
          No ads, no analytics SDKs, no trackers, and we don't sell or share your data with third
          parties for marketing. The only outside service involved is our hosting provider
          (Render), which stores the database and runs the API on our behalf.
        </p>

        <h2>Sharing a reading</h2>
        <p>
          If you use the "Share" button, we generate an image and a link for that specific
          reading. Anyone who has that link can view it - treat it like you would any link you
          hand out. It isn't listed publicly or searchable anywhere.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Readings are kept indefinitely so your history stays available. If you'd like a
          specific reading deleted, contact us (below) with the reading's id (visible in its
          share link) or roughly when you submitted it.
        </p>

        <h2>Children's privacy</h2>
        <p>
          This app isn't directed at children and we don't knowingly collect information from
          anyone using it to ask about their own conception - it's meant for expectant parents
          and the people around them.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, we'll update the date at the top of this page.</p>

        <h2>Contact</h2>
        <p>
          Questions, or want a reading deleted? Email{' '}
          <a href="mailto:oldwivesreveal@gmail.com">oldwivesreveal@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
