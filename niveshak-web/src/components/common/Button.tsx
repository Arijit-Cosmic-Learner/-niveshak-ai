import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'text';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const base = 'inline-flex items-center justify-center font-sora font-semibold transition-all duration-150 rounded-md text-sm leading-none cursor-pointer';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white px-6 py-3.5 hover:bg-accent-light active:scale-[0.98] disabled:opacity-40',
  ghost:   'border border-accent text-accent px-6 py-3.5 hover:bg-accent/10 active:scale-[0.98] disabled:opacity-40',
  text:    'text-accent underline-offset-2 hover:underline px-2 py-1 disabled:opacity-40',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  fullWidth,
  type = 'button',
  className = '',
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}