import { useState } from "react";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { useData } from "../../context/DataContext";
import { KURIR_NAMA } from "../../lib/constants";

const statusOptions = ["Dijemput", "Diproses", "Diantar", "Selesai"];

const initialForm = {
  id: "",
  jam: "",
  jenis: "jemput",
  done: false,
};

export default function Jadwal() {
  const { slots, addSlot } = useData();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const filteredSchedule = slots.filter((item) =>
    [item.jam, item.jenis].some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchedule.length / 5));
  const visibleSlots = filteredSchedule.slice((page - 1) * 5, page * 5);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const openEdit = (slot) => {
    setEditId(slot.id);
    setForm({
      id: slot.id,
      jam: slot.jam,
      jenis: slot.jenis,
      done: slot.done || false,
    });
    setShowForm(true);
    setError("");
  };

  const handleSave = () => {
    if (!form.jam) {
      setError("Harap lengkapi jam.");
      return;
    }

    const result = addSlot({
      id: editId || undefined,
      jam: form.jam,
      jenis: form.jenis,
      done: form.done,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(editId ? "Slot jadwal berhasil diperbarui." : "Slot jadwal berhasil ditambahkan.");
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Jadwal Antar-Jemput"
        showSearch={false}
        showAdd
        addText="Tambah Slot"
        onAdd={() => {
          setShowForm(true);
          setEditId(null);
          setForm(initialForm);
          setError("");
        }}
      />

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Cari Jadwal</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tanggal atau jam..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Kurir: <strong>{KURIR_NAMA}</strong> (1 kurir)
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>
        )}
        {error && !showForm && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold mb-4">{editId ? "Ubah Slot Jadwal" : "Tambah Slot Jadwal"}</h2>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-4">{error}</div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Jam</label>
                <input type="time" value={form.jam} onChange={(e) => handleInputChange("jam", e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Jenis</label>
                <select value={form.jenis} onChange={(e) => handleInputChange("jenis", e.target.value)} className="w-full px-4 py-2.5 border rounded-xl bg-white">
                  <option value="jemput">Penjemputan</option>
                  <option value="antar">Pengantaran</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Selesai</label>
                <select value={form.done ? "1" : "0"} onChange={(e) => handleInputChange("done", e.target.value === "1")} className="w-full px-4 py-2.5 border rounded-xl bg-white">
                  <option value="0">Belum</option>
                  <option value="1">Selesai</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setError(""); }} className="px-5 py-3 rounded-xl border font-semibold hover:bg-gray-100">
                Batal
              </button>
              <button type="button" onClick={handleSave} className="px-5 py-3 rounded-xl bg-[#1565C0] text-white font-semibold hover:bg-[#0f4d8a]">
                Simpan
              </button>
            </div>
          </div>
        )}

                {filteredSchedule.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Belum ada jadwal.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                          {["Jam", "Jenis", "Status", "Aksi"].map((h) => (
                            <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">{h}</th>
                          ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleSlots.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{item.jam}</td>
                    <td className="px-4 py-4 text-sm capitalize">{item.jenis}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        disabled={item.done}
                        onClick={() => addSlot({ id: item.id, jam: item.jam, jenis: item.jenis, terisi: item.terisi, done: true })}
                        className={`px-3 py-1 rounded-xl text-sm font-semibold ${item.done ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-800"}`}
                      >
                        {item.done ? "Selesai" : "Selesai"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => !item.done && openEdit(item)} disabled={item.done} className={`text-sm font-semibold ${item.done ? "text-gray-400" : "text-[#1565C0] hover:underline"}`}>
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{filteredSchedule.length} slot</p>
          <div className="flex gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border rounded-xl disabled:opacity-50">Sebelumnya</button>
            <span className="px-4 py-2 bg-blue-50 rounded-xl text-sm font-semibold">{page}/{totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded-xl disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
