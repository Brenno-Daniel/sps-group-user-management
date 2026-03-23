import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const PLACEHOLDER_MOBILE = "Buscar usuário (nome, e-mail ou tipo)";
const PLACEHOLDER_DESKTOP = "Buscar por nome, e-mail ou tipo de usuário…";

const fieldClass =
  "w-full min-h-[44px] rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-slate-900 " +
  "placeholder:text-sps-secondary shadow-sm transition-[border-color,box-shadow] duration-200 " +
  "focus:border-sps-primary focus:outline-none focus:ring-2 focus:ring-sps-accent/40 " +
  "motion-reduce:transition-none";

export function UserSearchInput({ value, onChange, id, className = "" }) {
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 730px)");
    const apply = () =>
      setPlaceholder(mq.matches ? PLACEHOLDER_MOBILE : PLACEHOLDER_DESKTOP);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className={`group relative w-full ${className}`.trim()}>
      <span
        className={
          "pointer-events-none absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 " +
          "items-center justify-center text-sps-secondary " +
          "transform-gpu transition-[transform,color] duration-200 ease-out " +
          "motion-reduce:transform-none motion-reduce:transition-colors " +
          "group-hover:-translate-y-6 group-hover:text-sps-primary " +
          "group-focus-within:-translate-y-6 group-focus-within:text-sps-hover"
        }
        aria-hidden
      >
        <Search className="h-5 w-5 shrink-0" strokeWidth={2} />
      </span>
      <input
        id={id || undefined}
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar usuários por nome, e-mail ou tipo"
        className={fieldClass}
      />
    </div>
  );
}
