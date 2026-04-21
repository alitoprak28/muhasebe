import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
}) => {
  if (!open) {
    return null;
  }

  const sizeClass =
    size === "xl"
      ? "max-w-5xl"
      : size === "md"
        ? "max-w-2xl"
        : "max-w-3xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-[32px] bg-white p-6 shadow-panel",
          sizeClass
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-extrabold text-ink">{title}</h3>
            {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

