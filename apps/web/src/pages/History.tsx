import { Link } from 'react-router-dom';
import { HistoryList } from '../components/HistoryList';

export function History() {
  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">The ledger</p>
        <h1>Past Reckonings</h1>
        <p className="lede">Every reading taken so far, oldest wisdom first.</p>
      </header>

      <nav className="page-nav">
        <Link to="/home">← New reckoning</Link>
      </nav>

      <HistoryList />
    </div>
  );
}
