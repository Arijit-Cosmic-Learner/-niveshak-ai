import { InstrumentType } from '@t/instruments';

const badgeStyles: Record<InstrumentType, { bg: string; text: string; border: string }> = {
  [InstrumentType.GOVERNMENT_SCHEME]: { bg: 'bg-badge-govt', text: 'text-[#3A7000]', border: 'border-lime-dark' },
  [InstrumentType.MUTUAL_FUND]:       { bg: 'bg-badge-mf',   text: 'text-[#1A56A0]', border: 'border-[#93C5FD]' },
  [InstrumentType.GOLD]:              { bg: 'bg-badge-gold', text: 'text-[#9A6C00]', border: 'border-[#FCD34D]' },
  [InstrumentType.BANK_SCHEME]:       { bg: 'bg-badge-bank', text: 'text-[#6334A8]', border: 'border-[#C4B5FD]' },
  [InstrumentType.NPS]:               { bg: 'bg-badge-nps',  text: 'text-[#A03000]', border: 'border-[#FDBA74]' },
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
