import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-ink text-white shadow-soft hover:translate-y-[-1px] hover:bg-slate-900 focus:ring-2 focus:ring-ink/20",
  secondary:
    "bg-brand-600 text-white shadow-soft hover:translate-y-[-1px] hover:bg-brand-700 focus:ring-2 focus:ring-brand-200",
  ghost:
    "border border-slate-200 bg-white text-ink hover:bg-slate-50 focus:ring-2 focus:ring-slate-200",
  danger:
    "bg-danger-500 text-white shadow-soft hover:bg-danger-600 focus:ring-2 focus:ring-danger-100",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  ...props
}) => {
  const sizeClasses =
    size === "sm" ? "h-10 px-3 text-sm" : size === "lg" ? "h-12 px-5" : "h-11 px-4";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all",
        sizeClasses,
        variants[variant],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </button>
  );
};

