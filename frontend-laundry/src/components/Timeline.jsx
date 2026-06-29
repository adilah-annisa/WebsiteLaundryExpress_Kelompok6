import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";

export default function Timeline({ items = [] }) {
  if (!items.length) return null;

  return (
    <ol className="relative space-y-0">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const done = item.done !== false;

        return (
          <li key={item.id || index} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-0.5 ${done ? "bg-emerald-300" : "bg-slate-200"}`}
                aria-hidden="true"
              />
            )}
            <span className={`relative z-10 mt-0.5 shrink-0 ${done ? "text-emerald-500" : "text-slate-300"}`}>
              {done ? <IoCheckmarkCircle className="text-2xl" /> : <IoEllipseOutline className="text-2xl" />}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>{item.title}</p>
              {item.time && <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>}
              {item.description && <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
              {item.image && (
                <img src={item.image} alt={item.title} className="mt-3 w-full max-h-48 rounded-xl border border-slate-200 object-cover" />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
