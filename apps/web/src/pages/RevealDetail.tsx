import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReveal } from '../api/reveals';
import { RevealResult } from '../components/RevealResult';
import { formatDate } from '../lib/format';

export function RevealDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: reveal,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reveal', id],
    queryFn: () => getReveal(id!),
    enabled: !!id,
  });

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">A past reckoning</p>
        <h1>
          <Link to="/home">Old Wives' Reveal</Link>
        </h1>
        {reveal ? (
          <p className="lede">
            Reckoned {formatDate(reveal.reckonDate)} — father born {formatDate(reveal.fatherBirthDate)}, mother born{' '}
            {formatDate(reveal.motherBirthDate)}.
          </p>
        ) : null}
      </header>

      <nav className="page-nav">
        <Link to="/history">← Past reckonings</Link>
      </nav>

      {isLoading ? <p className="lede">Loading…</p> : null}
      {isError ? <p className="error">{(error as Error).message}</p> : null}

      {reveal ? <RevealResult reveal={reveal} /> : null}
    </div>
  );
}
