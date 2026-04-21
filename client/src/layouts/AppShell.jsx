import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Topbar } from "../components/navigation/Topbar";

export const AppShell = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 p-4 lg:p-6">
        <Sidebar />
        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-6">
          <Topbar />
          <main className="flex-1 rounded-[28px] border border-white/60 bg-white/75 p-4 shadow-panel backdrop-blur-xl lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

