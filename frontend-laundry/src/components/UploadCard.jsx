import { useState } from "react";
import { IoCloudUploadOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import Button from "./ui/Button";
import { Alert } from "./ui/Toast";
import { Card, CardBody } from "./ui/Card";

const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadCard({ onUpload, loading = false, error = "" }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    setLocalError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("File harus berupa gambar (JPG/PNG).");
      return;
    }
    if (file.size > MAX_SIZE) {
      setLocalError("Ukuran file maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    reader.onerror = () => setLocalError("Upload gagal. Silakan unggah ulang.");
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProgress(100);
      onUpload?.(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const displayError = error || localError;

  return (
    <Card>
      <CardBody className="space-y-4">
        {(displayError) && <Alert variant="error">{displayError}</Alert>}

        {!previewImage ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={loading} />
            <IoCloudUploadOutline className="text-5xl text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
            <p className="font-semibold text-slate-700">Seret atau klik untuk unggah</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG — Maks 5MB</p>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200">
              <img src={previewImage} alt="Preview" className="w-full max-h-56 object-cover" />
              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <IoCheckmarkCircleOutline /> Dipilih
              </span>
            </div>
            {progress > 0 && progress < 100 && (
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            )}
            <Button variant="secondary" className="w-full" onClick={() => { setPreviewImage(null); setProgress(0); setLocalError(""); }}>
              Upload Ulang
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
