import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: 'neutral' | 'error';
  children?: ReactNode;
}

// Estado vazio ou de erro: diz o que aconteceu e oferece o próximo passo.
const StateMessage = ({ icon: Icon, title, description, tone = 'neutral', children }: StateMessageProps) => {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className="mx-auto flex max-w-sm flex-col items-center py-16 text-center"
    >
      <Icon className={`mb-4 size-10 ${tone === 'error' ? 'text-red-600' : 'text-slate-400'}`} strokeWidth={1.5} />
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
};

export default StateMessage;
