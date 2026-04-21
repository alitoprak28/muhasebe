import { Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="glass-panel hidden w-[280px] shrink-0 rounded-[32px] border border-white/60 p-5 shadow-panel lg:flex lg:flex-col">
      <div className="flex items-center gap-3 rounded-[24px] bg-ink px-4 py-4 text-white shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-heading text-lg font-extrabold">NovaLedger</p>
          <p className="text-sm text-white/70">Muhasebe Yonetim Paneli</p>
        </div>
      </div>

      <div className="mt-8 flex-1 space-y-7">
        {navigation.map((section) => {
          const items = section.items.filter((item) => item.roles.includes(user?.role));

          if (!items.length) {
            return null;
          }

          return (
            <div key={section.title}>
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                {section.title}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-ink text-white shadow-soft"
                            : "text-muted hover:bg-slate-100 hover:text-ink"
                        )
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-brand-900 to-ink p-4 text-white">
        <p className="text-xs uppercase tracking-[0.22em] text-white/60">Oturum</p>
        <p className="mt-2 font-heading text-lg font-bold">{user?.name}</p>
        <p className="text-sm text-white/70">{user?.email}</p>
      </div>
    </aside>
  );
};

