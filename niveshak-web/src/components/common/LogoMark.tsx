interface Props { size?: 'sm' | 'md' | 'lg'; }

const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
const textMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

export function LogoMark({ size = 'md' }: Props) {
  return (
    <div className={`${sizeMap[size]} bg-navy rounded-sm flex items-center justify-center flex-shrink-0`}>
      <span className={`font-sora font-extrabold text-white leading-none ${textMap[size]}`}>Ni</span>
    </div>
  );
}