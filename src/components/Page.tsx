import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  showBack?: boolean;
  className?: string;
  children: ReactNode;
}

// Molde único de página: mesma largura, respiro e cabeçalho em todas as telas.
const Page = ({ title, subtitle, showBack = false, className, children }: PageProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8", className)}>
      {title && (
        <div className="mb-6 flex items-start gap-2">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="-ml-2 mt-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-balance">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Page;
