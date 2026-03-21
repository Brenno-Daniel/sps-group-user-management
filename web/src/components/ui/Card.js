export function Card({ className = "", children, as: Component = "div", ...rest }) {
  return (
    <Component
      className={`rounded-2xl bg-white p-6 shadow-card ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
