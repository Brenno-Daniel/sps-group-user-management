import { forwardRef, useId } from "react";

const fieldClass =
  "w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 " +
  "shadow-sm transition focus:border-sps-primary focus:outline-none focus:ring-2 " +
  "focus:ring-sps-accent/40 disabled:cursor-not-allowed disabled:bg-slate-50";

export const Select = forwardRef(function Select(
  {
    label,
    id: idProp,
    error,
    children,
    className = "",
    containerClassName = "",
    ...rest
  },
  ref,
) {
  const uid = useId();
  const id = idProp || uid;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={containerClassName}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-800"
        >
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={id}
        className={`${fieldClass} ${className}`.trim()}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
