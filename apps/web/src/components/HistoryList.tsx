import { useQuery } from '@tanstack/react-query';
import { listReveals } from '../api/reveals';
import { formatDate } from '../lib/format';

export function HistoryList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reveals'],
    queryFn: () => listReveals(10),
  });

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  return (
    <section className="history">
      <h3>Past reckonings</h3>
      {data.map((reveal) => (
        <div className="history-row" key={reveal.id}>
          <span>Father {formatDate(reveal.fatherBirthDate)}</span>
          <span>Mother {formatDate(reveal.motherBirthDate)}</span>
          <span>Reckoned {formatDate(reveal.reckonDate)}</span>
          <span className={`result-tag ${reveal.result.toLowerCase()}`}>{reveal.result}</span>
        </div>
      ))}
    </section>
  );
}
