import { useState } from 'react';
import PageHeader from '../DashboardAdmin/components/PageHeader';
import StatusBadge from '../DashboardAdmin/components/StatusBadge';

const scheduleData = [
  { seri: '#00001', name: 'Budi', date: '24 April 2024', banyak: '5/5', titik: '75%', status: 'Selesai' },
  { seri: '#00002', name: 'Susi', date: '24 April 2024', banyak: '4/5', titik: '60%', status: 'Diproses' },
  { seri: '#00003', name: 'Andi', date: '24 April 2024', banyak: '2/5', titik: '40%', status: 'Dijemput' },
  { seri: '#00004', name: 'Lina', date: '24 April 2024', banyak: '2/5', titik: '50%', status: 'Diantar' },
];

const statusOptions = ['Selesai', 'Diproses', 'Dijemput', 'Diantar'];
const initialForm = {
  seri: '',
  name: '',
  date: '',
  banyak: '1/5',
  titik: '0%',
  status: 'Dijemput',
};

export default function Jadwal() {
  const [search, setSearch] = useState('');
  const [schedule, setSchedule] = useState(scheduleData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [kurir, setKurir] = useState('Samsont');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');

  const filteredSchedule = schedule.filter((item) =>
    [item.name, item.seri].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchedule.length / 5));
  const visibleSlots = filteredSchedule.slice((page - 1) * 5, page * 5);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.seri || !form.name || !form.date) {
      setMessage('Harap lengkapi seri, nama, dan tanggal.');
      return;
    }

    setSchedule((prev) => [form, ...prev]);
    setForm(initialForm);
    setShowForm(false);
    setMessage('Slot penjemputan berhasil ditambahkan.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slot Waktu Penjemputan"
        showSearch={false}
        showAdd
        addText="+ Tambah Slot"
        onAdd={() => setShowForm((prev) => !prev)}
      />

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.9fr] items-end">
          <div>
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Cari Nama atau Seri</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama atau Seri"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Kurir</label>
            <select
              value={kurir}
              onChange={(e) => setKurir(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter bg-white shadow-sm"
            >
              <option>Samsont</option>
              <option>Rizal</option>
              <option>Nina</option>
            </select>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
              <h2 className="text-lg font-inter-semibold text-gray-800">Form Tambah Slot</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Tutup
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Seri</label>
                <input
                  type="text"
                  value={form.seri}
                  onChange={(e) => handleInputChange('seri', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Nama Pelanggan</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Tanggal</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Banyak</label>
                <input
                  type="text"
                  value={form.banyak}
                  onChange={(e) => handleInputChange('banyak', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Titikul</label>
                <input
                  type="text"
                  value={form.titik}
                  onChange={(e) => handleInputChange('titik', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-inter-semibold text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-inter-semibold text-white hover:bg-[#0f4d8a] transition"
              >
                Simpan Slot
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                {['Seri', 'Nama Pelanggan', 'Tanggal', 'Banyak', 'Titikul', 'Status'].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleSlots.map((item) => (
                <tr key={item.seri} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.seri}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.banyak}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.titik}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600 font-poppins">Menampilkan {filteredSchedule.length} slot</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Sebelumnya
            </button>
            <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-inter-semibold text-blue-700">{page}/{totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
