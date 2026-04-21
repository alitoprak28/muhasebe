import { Inbox } from "lucide-react";

export const EmptyState = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft">
        <Inbox className="h-6 w-6 text-slate-500" />
      </div>
      <h3 className="font-heading text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
};

