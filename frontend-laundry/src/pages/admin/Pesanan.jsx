import { useMemo, useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Card, CardBody } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Toast";
import StatusBadge from "../../components/StatusBadge";
import { useData } from "../../context/DataContext";
import { ADMIN_ORDER_STATUSES, formatRupiah } from "../../lib/constants";

export default function Pesanan() {
  const { orders, setOrderWeight, getOrderById } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  // status field removed per requirements
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [beratInput, setBeratInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredOrders = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders.filter((order) => [order.nama, order.id].some((v) => v.toLowerCase().includes(q)));
  }, [orders, searchTerm]);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setBeratInput(order.berat != null ? String(order.berat) : "");
    setMessage("");
    setError("");
  };

  const handleSave = () => {
    if (!selectedOrder) return;

    if (beratInput.trim()) {
      const result = setOrderWeight(selectedOrder.id, beratInput);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(`Berat ${result.berat} Kg disimpan. Total: ${result.formatted}`);
    } else {
      setMessage("Data pesanan berhasil diperbarui.");
    }

    const updated = getOrderById(selectedOrder.id);
    if (updated) setSelectedOrder(updated);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
      </div>

      <Card>
        <CardBody className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Cari nama atau kode pesanan..." className="flex-1" />
          </div>

          <Table
            columns={[
              { key: "id", label: "Kode" },
              { key: "nama", label: "Pelanggan" },
              { key: "layananLabel", label: "Layanan" },
              {
                key: "jadwal",
                label: "Jadwal",
                render: (row) => (row.tanggal ? `${row.tanggal} ${row.jam}` : "-"),
              },
              {
                key: "berat",
                label: "Berat",
                render: (row) => (row.berat != null ? `${row.berat} Kg` : "Menunggu"),
              },
              {
                key: "total",
                label: "Total",
                render: (row) => (row.total != null ? formatRupiah(row.total) : "-"),
              },
              // status column removed per requirements
              {
                key: "aksi",
                label: "Aksi",
                render: (row) => (
                  <Button variant="ghost" size="sm" onClick={() => openDetail(row)}>
                    Detail
                  </Button>
                ),
              },
            ]}
            data={filteredOrders}
            emptyMessage="Daftar pesanan kosong."
          />
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Detail Pesanan ${selectedOrder?.id || ""}`}
        subtitle={selectedOrder ? `${selectedOrder.nama} • ${selectedOrder.nohp}` : ""}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>Tutup</Button>
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </>
        }
      >
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {message && <Alert variant="success" className="mb-4">{message}</Alert>}

        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <p><span className="text-slate-500">Nama Pelanggan:</span> <strong>{selectedOrder.nama}</strong></p>
              <p><span className="text-slate-500">Telepon:</span> {selectedOrder.nohp}</p>
              <p><span className="text-slate-500">Alamat:</span> {selectedOrder.alamat}</p>
              <p><span className="text-slate-500">Layanan:</span> {selectedOrder.layananLabel}</p>
              <p><span className="text-slate-500">Tarif:</span> Rp {selectedOrder.tarifPerKg.toLocaleString("id-ID")}/Kg</p>
              <p><span className="text-slate-500">Jadwal:</span> {selectedOrder.tanggal ? `${selectedOrder.tanggal} ${selectedOrder.jam}` : "Belum dipilih"}</p>
              <p><span className="text-slate-500">Jenis Antar-Jemput:</span> {
                selectedOrder.pengantaran === "jemput" ? "Jemput Saja" :
                selectedOrder.pengantaran === "antar" ? "Antar Saja" :
                "Antar-Jemput"
              }</p>
              {/* Status removed from admin detail per requirements */}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <Input
                label="Input Berat Laundry (Kg) *"
                type="number"
                min="0"
                step="0.1"
                value={beratInput}
                onChange={(e) => { setBeratInput(e.target.value); setError(""); }}
                placeholder="Contoh: 3.5"
              />
              {beratInput && selectedOrder.tarifPerKg && (
                <p className="mt-2 text-sm text-blue-800 font-semibold">
                  Estimasi Total: {beratInput} Kg × Rp {selectedOrder.tarifPerKg.toLocaleString("id-ID")} ={" "}
                  {formatRupiah(Number(beratInput) * selectedOrder.tarifPerKg)}
                </p>
              )}
            </div>

            {selectedOrder.catatan && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs uppercase text-gray-500 font-semibold">Catatan Pesanan</p>
                <p className="text-sm text-gray-700 mt-2">{selectedOrder.catatan}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
