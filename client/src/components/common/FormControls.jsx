import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const FieldGroup = ({ label, hint, error, children }) => {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-sm text-danger-500">{error}</p> : null}
    </label>
  );
};

export const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-50";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputClassName, className)} {...props} />
));

Input.displayName = "Input";

export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(inputClassName, className)} {...props}>
    {children}
  </select>
));

Select.displayName = "Select";

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(inputClassName, "min-h-[120px] resize-y", className)}
    {...props}
  />
));

Textarea.displayName = "Textarea";
