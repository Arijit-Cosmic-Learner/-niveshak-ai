interface Props { progress: number; }

export function ProgressBar({ progress }: Props) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="w-full h-1 bg-input rounded-full overflow-hidden">
      <div
        className="h-full bg-accent rounded-full transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}