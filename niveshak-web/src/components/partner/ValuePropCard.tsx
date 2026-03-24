interface Props {
  icon:  string;
  title: string;
  desc:  string;
}

export function ValuePropCard({ icon, title, desc }: Props) {
  return (
    <div className="bg-black-light border border-border-dark rounded-lg p-4 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-sm bg-lime flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-sora font-bold text-white text-sm mb-1">{title}</p>
        <p className="text-grey-mid text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
