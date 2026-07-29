import type { Reveal } from '@oldwivesreveal/shared-types';
import { formatSinceRenewal } from '../lib/format';
import { ShareButton } from './ShareButton';

interface VerdictCardProps {
  reveal: Reveal;
}

export function VerdictCard({ reveal }: VerdictCardProps) {
  const { father, mother, newerParent, motherOlder, result } = reveal;

  const lines = [
    `Mother: ${formatSinceRenewal(mother.remainderYears)} (of 3)`,
    `Father: ${formatSinceRenewal(father.remainderYears)} (of 4)`,
    newerParent === 'tie'
      ? '-> Both renew together. Reading is even.'
      : `-> ${newerParent === 'father' ? 'Father' : 'Mother'} is running fresher.`,
  ];

  if (result !== 'TIE') {
    lines.push(
      motherOlder
        ? 'Mother is older than father — the reading reverses.'
        : 'Father is older than mother — the reading stands.',
    );
  }

  lines.push(`Result: ${result}${result === 'TIE' ? ' — call it in the air' : ''}`);

  const resultClass = result === 'TIE' ? 'tie' : result === 'BOY' ? 'boy' : 'girl';

  return (
    <section className="verdict-card">
      <p className="verdict-eyebrow">The reading</p>
      <h2 className={resultClass}>{result}</h2>
      <pre className="ledger-note">{lines.join('\n')}</pre>
      <ShareButton reveal={reveal} />
    </section>
  );
}
