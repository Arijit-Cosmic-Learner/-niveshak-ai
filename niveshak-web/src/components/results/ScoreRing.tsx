import { RiskProfile } from '@t/onboarding';

interface Props {
  score:   number;
  profile: RiskProfile;
  label:   string;
}

const profileColor: Record<RiskProfile, string> = {
  [RiskProfile.CONSERVATIVE]: '#93C5FD',
  [RiskProfile.BALANCED]:     '#FCD34D',
  [RiskProfile.GROWTH]:       '#AAFF00',
};

export function ScoreRing({ score, profile, label }: Props) {
  const radius       = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset   = circumference - (score / 100) * circumference;
  const color        = profileColor[profile] ?? '#AAFF00';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#2A2A2A" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sora font-extrabold text-2xl text-white">{score}</span>
          <span className="text-[9px] text-grey-mid font-sora">/ 100</span>
        </div>
      </div>
      <p className="font-sora font-bold text-white text-sm">{label}</p>
    </div>
  );
}
