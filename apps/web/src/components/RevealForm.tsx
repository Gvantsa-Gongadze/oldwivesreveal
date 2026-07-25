import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Reveal } from '@oldwivesreveal/shared-types';
import { createReveal } from '../api/reveals';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface RevealFormProps {
  onRevealed: (reveal: Reveal) => void;
}

export function RevealForm({ onRevealed }: RevealFormProps) {
  const [fatherBirthDate, setFatherBirthDate] = useState('');
  const [motherBirthDate, setMotherBirthDate] = useState('');
  const [reckonDate, setReckonDate] = useState(todayIso());
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createReveal,
    onSuccess: (reveal) => {
      onRevealed(reveal);
      queryClient.invalidateQueries({ queryKey: ['reveals'] });
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!fatherBirthDate || !motherBirthDate || !reckonDate) {
      return;
    }
    mutation.mutate({ fatherBirthDate, motherBirthDate, reckonDate });
  }

  const missingFields = !fatherBirthDate || !motherBirthDate || !reckonDate;

  return (
    <form className="ledger-card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="fatherBirth">Father's birth</label>
        <input
          type="date"
          id="fatherBirth"
          value={fatherBirthDate}
          onChange={(e) => setFatherBirthDate(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="motherBirth">Mother's birth</label>
        <input
          type="date"
          id="motherBirth"
          value={motherBirthDate}
          onChange={(e) => setMotherBirthDate(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="reckonDate">Date to reckon from</label>
        <input
          type="date"
          id="reckonDate"
          value={reckonDate}
          onChange={(e) => setReckonDate(e.target.value)}
        />
      </div>
      <button className="primary-button" type="submit" disabled={mutation.isPending || missingFields}>
        {mutation.isPending ? 'Reckoning…' : 'Reckon the blood'}
      </button>
      {mutation.isError ? <p className="error">{(mutation.error as Error).message}</p> : null}
    </form>
  );
}
