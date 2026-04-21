import { cn } from "../../utils/cn";

const styles = {
  active: "bg-accent-50 text-accent-600",
  inactive: "bg-slate-100 text-slate-600",
  paid: "bg-accent-50 text-accent-600",
  pending: "bg-warning-50 text-warning-600",
  scheduled: "bg-brand-50 text-brand-700",
  partial: "bg-brand-50 text-brand-700",
  completed: "bg-accent-50 text-accent-600",
  approved: "bg-accent-50 text-accent-600",
  sent: "bg-brand-50 text-brand-700",
  negotiation: "bg-warning-50 text-warning-600",
  received: "bg-accent-50 text-accent-600",
  waiting: "bg-warning-50 text-warning-600",
  waiting_dispatch: "bg-warning-50 text-warning-600",
  waiting_invoice: "bg-warning-50 text-warning-600",
  partial_dispatch: "bg-brand-50 text-brand-700",
  posted: "bg-accent-50 text-accent-600",
  review: "bg-warning-50 text-warning-600",
  archived: "bg-slate-100 text-slate-600",
  portfolio: "bg-brand-50 text-brand-700",
  approaching_due: "bg-danger-50 text-danger-500",
  sales: "bg-accent-50 text-accent-600",
  purchase: "bg-brand-50 text-brand-700",
  invoice_based: "bg-accent-50 text-accent-600",
  current_account: "bg-brand-50 text-brand-700",
  supplier: "bg-brand-50 text-brand-700",
  personnel: "bg-warning-50 text-warning-600",
  tax: "bg-danger-50 text-danger-500",
  create: "bg-accent-50 text-accent-600",
  update: "bg-brand-50 text-brand-700",
  upload: "bg-warning-50 text-warning-600",
  admin: "bg-ink text-white",
  accountant: "bg-brand-50 text-brand-700",
  viewer: "bg-slate-100 text-slate-600",
  credit: "bg-accent-50 text-accent-600",
  debit: "bg-danger-50 text-danger-500",
  in: "bg-accent-50 text-accent-600",
  out: "bg-danger-50 text-danger-500",
  critical: "bg-danger-50 text-danger-500",
  warning: "bg-warning-50 text-warning-600",
  info: "bg-brand-50 text-brand-700",
};

export const StatusBadge = ({ value, children }) => {
  const key = String(value || "").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        styles[key] || "bg-slate-100 text-slate-600"
      )}
    >
      {children || value}
    </span>
  );
};
