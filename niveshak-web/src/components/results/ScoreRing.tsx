import { RiskProfile } from '@t/onboarding';

interface Props {
  score:   number;
  profile: RiskProfile;
  label:   string;
}

const profileColor: Record<RiskProfile, string> = {
  [RiskProfile.CONSERVATIVE]: '#1B2B4B',
  [RiskProfile.BALANCED]:     '#E07B39',
  [RiskProfile.GROWTH]:       '#C4622A',
};

export function ScoreRing({ score, profile, label }: Props) {
  const radius        = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference - (score / 100) * circumference;
  const color         = profileColor[profile] ?? '#E07B39';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgb(var(--border-rgb))" strokeWidth="10" />
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
          <span className="font-sora font-extrabold text-2xl text-content">{score}</span>
          <span className="text-[9px] text-hint font-sora">/ 100</span>
        </div>
      </div>
      <p className="font-sora font-bold text-content text-sm">{label}</p>
    </div>
  );
}