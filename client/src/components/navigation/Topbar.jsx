import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Button } from "../common/Button";

export const Topbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const pageTitle = usePageTitle();
  const today = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="glass-panel rounded-[30px] border border-white/70 px-5 py-4 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{today}</p>
          <h1 className="font-heading text-2xl font-extrabold text-ink">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Aktif Rol</p>
            <p className="font-semibold capitalize text-ink">{user?.role}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} icon={LogOut}>
            Cikis
          </Button>
        </div>
      </div>
    </header>
  );
};

