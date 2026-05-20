import { useState } from 'react';
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5';

export default function PageHeader({
  title,
  showSearch = true,
  showAdd = false,
  addText = 'Tambah',
  onAdd,
  searchValue = '',
  onSearchChange,
}) {
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const currentSearch = onSearchChange ? searchValue : search;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      
      {showSearch && (
        <div className="relative w-full sm:w-80">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, seri, atau alamat..."
            value={currentSearch}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter text-sm shadow-sm"
          />
        </div>
      )}
      
      {showAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="ml-auto sm:ml-0 flex items-center gap-2 px-4 py-2.5 bg-[#3b6fd8] text-white rounded-xl font-inter-semibold hover:bg-[#2e5bc8] shadow-sm transition-all h-min whitespace-nowrap"
        >
          <IoAddOutline className="text-sm" />
          {addText}
        </button>
      )}
    </div>
  );
}

