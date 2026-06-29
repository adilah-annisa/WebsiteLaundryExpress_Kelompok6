export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-slate-200/80 text-center">
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} Laundry Express — Sistem Manajemen Laundry
      </p>
    </footer>
  );
}
