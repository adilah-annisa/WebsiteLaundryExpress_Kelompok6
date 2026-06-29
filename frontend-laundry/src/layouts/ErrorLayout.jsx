import { Outlet } from "react-router-dom";

export default function ErrorLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
}
