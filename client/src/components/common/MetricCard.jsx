import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { cn } from "../../utils/cn";

export const MetricCard = ({
  title,
  value,
  tone = "default",
  subtitle,
  icon: Icon,
  isCurrency = true,
}) => {
  const isPositive = tone === "positive";
  const isNegative = tone === "negative";

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-3 font-heading text-3xl font-extrabold text-ink">
            {isCurrency ? formatCurrency(value) : value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            isPositive
              ? "bg-accent-50 text-accent-600"
              : isNegative
                ? "bg-danger-50 text-danger-500"
                : "bg-brand-50 text-brand-700"
          )}
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : isPositive ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : (
            <ArrowDownRight className="h-5 w-5" />
          )}
        </div>
      </div>
      {subtitle ? <p className="mt-4 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
};

