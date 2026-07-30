import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminUnauthorizedError, listAllReveals } from '../api/admin';
import { clearAdminToken, getAdminToken, setAdminToken } from '../lib/adminAuth';
import { formatDate, formatDateTime } from '../lib/format';
import { DatePicker } from '../components/DatePicker';

const PAGE_SIZE = 50;

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setChecking(true);
    setError(null);
    setAdminToken(password);
    try {
      await listAllReveals(1, 0);
      onUnlock();
    } catch (err) {
      clearAdminToken();
      setError(err instanceof AdminUnauthorizedError ? 'Incorrect password.' : (err as Error).message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <form className="admin-gate" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="admin-password">Admin password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="primary-button" disabled={checking || !password}>
        {checking ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}

function AdminTable() {
  const [offset, setOffset] = useState(0);
  const [motherBirthDate, setMotherBirthDate] = useState('');
  const [fatherBirthDate, setFatherBirthDate] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const filters = { motherBirthDate, fatherBirthDate };
  const hasFilters = Boolean(motherBirthDate || fatherBirthDate);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-reveals', offset, motherBirthDate, fatherBirthDate],
    queryFn: () => listAllReveals(PAGE_SIZE, offset, filters),
    retry: false,
  });

  function updateMotherFilter(value: string) {
    setMotherBirthDate(value);
    setOffset(0);
  }

  function updateFatherFilter(value: string) {
    setFatherBirthDate(value);
    setOffset(0);
  }

  function clearFilters() {
    setMotherBirthDate('');
    setFatherBirthDate('');
    setOffset(0);
  }

  const unauthorized = error instanceof AdminUnauthorizedError;

  useEffect(() => {
    if (unauthorized) {
      clearAdminToken();
      queryClient.removeQueries({ queryKey: ['admin-reveals'] });
    }
  }, [unauthorized, queryClient]);

  if (unauthorized) {
    return <PasswordGate onUnlock={() => queryClient.invalidateQueries({ queryKey: ['admin-reveals'] })} />;
  }

  function handleLogout() {
    clearAdminToken();
    queryClient.removeQueries({ queryKey: ['admin-reveals'] });
    setOffset(0);
  }

  return (
    <>
      <div className="admin-toolbar">
        <p className="admin-count">{data ? `${data.total} reveal${data.total === 1 ? '' : 's'} total` : ' '}</p>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="admin-filters">
        <div className="field">
          <label htmlFor="filter-mother">Mother born</label>
          <DatePicker id="filter-mother" value={motherBirthDate} onChange={updateMotherFilter} />
        </div>
        <div className="field">
          <label htmlFor="filter-father">Father born</label>
          <DatePicker id="filter-father" value={fatherBirthDate} onChange={updateFatherFilter} />
        </div>
        {hasFilters && (
          <button type="button" className="admin-logout admin-clear-filters" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {isLoading && <p className="admin-status">Loading…</p>}
      {isError && <p className="error">{(error as Error).message}</p>}

      {data && data.items.length === 0 && (
        <p className="admin-status">{hasFilters ? 'No reveals match those filters.' : 'No reveals yet.'}</p>
      )}

      {data && data.items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Mother</th>
                <th>Father</th>
                <th>Reckoned</th>
                <th>Result</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((reveal) => (
                <tr key={reveal.id} onClick={() => navigate(`/reveal/${reveal.id}`)}>
                  <td>{formatDateTime(reveal.createdAt)}</td>
                  <td>{formatDate(reveal.motherBirthDate)}</td>
                  <td>{formatDate(reveal.fatherBirthDate)}</td>
                  <td>{formatDate(reveal.reckonDate)}</td>
                  <td>
                    <span className={`result-tag ${reveal.result.toLowerCase()}`}>{reveal.result}</span>
                  </td>
                  <td className="admin-client-id">{reveal.clientId ? reveal.clientId.slice(0, 8) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <div className="admin-pager">
          <button
            type="button"
            className="admin-page-btn"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(o - PAGE_SIZE, 0))}
          >
            ← Newer
          </button>
          <button
            type="button"
            className="admin-page-btn"
            disabled={offset + PAGE_SIZE >= data.total}
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
          >
            Older →
          </button>
        </div>
      )}
    </>
  );
}

export function Admin() {
  const [unlocked, setUnlocked] = useState(() => Boolean(getAdminToken()));

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Not for the wives</p>
        <h1>All Reckonings</h1>
        <p className="lede">Every reading anyone has taken, unfiltered.</p>
      </header>

      <nav className="page-nav">
        <Link to="/home">← New reckoning</Link>
      </nav>

      {unlocked ? <AdminTable /> : <PasswordGate onUnlock={() => setUnlocked(true)} />}
    </div>
  );
}
