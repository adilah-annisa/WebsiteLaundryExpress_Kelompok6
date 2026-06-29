export default function Table({ columns, data, onRowClick, emptyMessage = "Tidak ada data." }) {
  if (!data?.length) {
    return <p className="text-center text-slate-500 py-10 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr
              key={row.id || row.kode || idx}
              onClick={() => onRowClick?.(row)}
              className={`bg-white ${onRowClick ? "cursor-pointer hover:bg-slate-50 transition-colors" : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-4 text-sm text-slate-700 sm:px-6">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
