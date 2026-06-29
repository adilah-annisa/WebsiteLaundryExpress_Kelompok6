import Button from "./Button";

export default function Pagination({ page, totalPages, onPageChange, className = "" }) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <p className="text-sm text-slate-500">
        Halaman <span className="font-semibold text-slate-700">{page}</span> dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Sebelumnya
        </Button>
        <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">{page}/{totalPages}</span>
        <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Berikutnya
        </Button>
      </div>
    </div>
  );
}
