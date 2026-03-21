import { forwardRef } from "react";

const base =
  "inline-flex items-center justify-center gap-2 font-medium " +
  "transform-gpu transition duration-200 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 active:duration-100 " +
  "motion-reduce:transform-none motion-reduce:transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sps-accent " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
  "disabled:hover:translate-y-0";

const variants = {
  primary:
    "min-h-[44px] px-8 py-2.5 rounded-xl text-white bg-sps-brand bg-sps-btn-primary " +
    "shadow-md hover:[background-image:none] hover:bg-sps-brand hover:text-sps-hover hover:shadow-lg",
  secondary:
    "min-h-[44px] px-6 py-2.5 rounded-xl bg-white text-sps-primary border border-sps-primary/20 " +
    "shadow-sm hover:bg-sps-primary/5 hover:shadow-md",
  icon:
    "h-11 w-11 shrink-0 rounded-xl bg-sps-primary text-white " +
    "shadow-md hover:bg-sps-accent hover:text-sps-hover hover:shadow-lg",
  ghost:
    "rounded-lg px-3 py-2 text-sps-primary shadow-none hover:bg-slate-100 hover:shadow-sm focus-visible:ring-sps-accent",
};

export const Button = forwardRef(function Button(
  { className = "", variant = "primary", type = "button", children, ...rest },
  ref,
) {
  const styles = variants[variant] || variants.primary;
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${styles} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
});
