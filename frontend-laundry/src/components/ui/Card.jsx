export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm ${hover ? "hover:shadow-md transition-shadow duration-200" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, title, subtitle, className = "" }) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 sm:px-6 ${className}`}>
      {title ? (
        <>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </>
      ) : (
        children
      )}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-4 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
