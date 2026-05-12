import { useState } from 'react';
import StatusBadge from './StatusBadge';
import dashboardData from '../data/dashboardData.json';

export default function DataTable({ dataKey, columns, className = '' }) {
  const [search, setSearch] = useState('');
  const data = dashboardData[dataKey] || [];

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-inter-semibold text-lg text-gray-800">
          Data {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col, index) => (
                <th key={index} className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {col.key === 'status' ? (
                      <StatusBadge status={row[col.key]} />
                    ) : col.render ? (
                      col.render(row)
                    ) : (
                      <span className="text-sm font-inter-medium text-gray-800">
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

