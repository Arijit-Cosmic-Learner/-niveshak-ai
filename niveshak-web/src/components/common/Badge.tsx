import { InstrumentType } from '@t/instruments';

const badgeStyles: Record<InstrumentType, { bg: string; text: string; border: string }> = {
  [InstrumentType.GOVERNMENT_SCHEME]: { bg: 'bg-badge-govt', text: 'text-navy',         border: 'border-navy/30' },
  [InstrumentType.MUTUAL_FUND]:       { bg: 'bg-badge-mf',   text: 'text-navy-light',   border: 'border-navy/30' },
  [InstrumentType.GOLD]:              { bg: 'bg-badge-gold', text: 'text-[#9A6C00]',     border: 'border-[#FCD34D]' },
  [InstrumentType.BANK_SCHEME]:       { bg: 'bg-badge-bank', text: 'text-navy',          border: 'border-navy/30' },
  [InstrumentType.NPS]:               { bg: 'bg-badge-nps',  text: 'text-accent-dark',   border: 'border-accent/30' },
};

interface Props { type: InstrumentType; }

export function Badge({ type }: Props) {
  const styles = badgeStyles[type];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
        styles.bg
      } ${styles.text} ${styles.border}`}
    >
      {type}
    </span>
  );
}